pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
// import "./SafeMath.sol";

import "@chainlink/contracts/src/v0.5/interfaces/AggregatorInterface.sol";

// import "./AggregatorInterface.sol";

contract HmyBridge {
    using SafeMath for uint256;

    mapping(bytes32 => bool) public usedEvents_;

    mapping(address => bool) public listERC;

    mapping(address => uint256) public wards;

    address public owner;
    address public oracleONE;

    mapping(address => address) public mappings;

    uint16 public threshold;
    mapping(bytes32 => uint16) confirmations;

    event Locked(
        address indexed addrTokenTo,
        address indexed sender,
        uint256 amountONE,
        uint256 priceONE,
        uint256 amountUSD,
        address recipient
    );

    event Unlocked(
        uint256 amountUSD,
        uint256 priceONE,
        uint256 amountONE,
        address recipient,
        bytes32 receiptId
    );

    event WithdrawONE(address indexed _owner, uint256 amount, string msg);

    modifier auth {
        require(wards[msg.sender] == 1, "HmyManager/not-authorized");
        _;
    }

    /**
     * @dev constructor
     */
    constructor() public {
        owner = msg.sender;
        wards[owner] = 1;
        threshold = 1;
        oracleONE = address(0x05d511aAfc16c7c12E60a2Ec4DbaF267eA72D420);
        listERC[address(0x0000000000000000000000000000000000000001)] = true;
        listERC[address(0xaD6D458402F60fD3Bd25163575031ACDce07538D)] = true;
        listERC[address(0xb4f7332ed719Eb4839f091EDDB2A3bA309739521)] = true;
        listERC[address(0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6)] = true;
    }

    function rely(address guy) external auth {
        wards[guy] = 1;
    }

    function deny(address guy) external auth {
        require(guy != owner, "HmyManager/cannot deny the owner");
        wards[guy] = 0;
    }

    function changeOracleONE(address _oracleONE) external auth {
        require(
            _oracleONE != address(0),
            "hmyBrigde/oracleONE is a zero address"
        );
        oracleONE = _oracleONE;
    }

    /**
     * @dev change threshold requirement
     * @param newTheshold new threshold requirement
     */
    function changeThreshold(uint16 newTheshold) public {
        require(
            msg.sender == owner,
            "HmyManager/only owner can change threshold"
        );
        threshold = newTheshold;
    }

    /**
     * @dev change listERC
     * @param _addrERC address of contract ERC in Ethereum
     * @param _status is staus of address ERC
     */
    function changeListERC(address _addrERC, bool _status) public auth {
        require(_addrERC != address(0), "address of oracle is a zero address");
        listERC[_addrERC] = _status;
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice(address _tokenERC) public view returns (int256) {
        AggregatorInterface priceFeed = AggregatorInterface(_tokenERC);
        int256 price = priceFeed.latestAnswer();
        return price;
    }

    /**
     * @dev lock ONE to be transfer ERC to recipient on ETH chain
     * @param addrTokenTo is address of tokenTo on Ethereum
     * @param amountONE amount of ONE to lock
     * @param recipient recipient address on the ethereum chain
     */
    function lockOne(
        address addrTokenTo,
        uint256 amountONE,
        address recipient
    ) public payable {
        require(
            listERC[addrTokenTo],
            "address token ERC are not currently supported"
        );
        require(amountONE > 0, "amount token locked is zero");
        require(amountONE == msg.value, "amount ONE and msg.value different");
        require(
            recipient != address(0),
            "hmyBrigde/recipient is a zero address"
        );
        uint256 _priceONE = uint256(getLatestPrice(oracleONE));
        uint256 _amountUSD = _priceONE * msg.value;
        emit Locked(
            addrTokenTo,
            msg.sender,
            msg.value,
            _priceONE,
            _amountUSD,
            recipient
        );
    }

    /**
     * @dev unlock ONE after locktoken them on ethereum chain
     * @param amountUSD amount USD of unlock on Harmony
     * @param recipient recipient of the unlock tokens
     * @param receiptId transaction hash of the locktoken event on harmony chain
     */
    function unlockOne(
        uint256 amountUSD,
        address payable recipient,
        bytes32 receiptId
    ) public auth {
        require(!usedEvents_[receiptId], "hmyBrigde/zero token unlocked");
        confirmations[receiptId] = confirmations[receiptId] + 1;
        if (confirmations[receiptId] < threshold) {
            return;
        }
        usedEvents_[receiptId] = true;
        // int256 a = 541000;
        // uint256 _priceONE = 541000;
        uint256 _priceONE = uint256(getLatestPrice(oracleONE));
        uint256 _amountONE = amountUSD.div(_priceONE);
        recipient.transfer(_amountONE);
        emit Unlocked(amountUSD, _priceONE, _amountONE, recipient, receiptId);
        // delete confirmations entry for receiptId
        delete confirmations[receiptId];
    }

    /**
     * get balance ONE
     */
    function getBalanceOne() public view returns (uint256) {
        return address(this).balance;
    }

    /** Function withdraw ONE to account Manager
     */
    function withdraw(address payable _owner) public auth {
        uint256 balanceBefore = address(this).balance;
        _owner.transfer(address(this).balance);
        emit WithdrawONE(_owner, balanceBefore, "Withdraw ETH");
    }

    function() external payable {}
}
