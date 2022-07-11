// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NminSite is ERC721, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("NminSite", "NFS") {}

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  ////////////////////////////////////////////////////////////////

  event NewWebsite(uint256 tokenId, address newAddress, address owner);

  // website的結構
  struct WebSite {
    address addr; // 合約地址
    string title; // 標題
    string content; // 內文
    string coverURL; // 封面
  }

  mapping(uint256 => WebSite) public websites;

  // 用戶發布Website
  function newWebsite(
    string calldata name,
    string calldata symbol,
    string calldata coverURL,
    string calldata title,
    string calldata content
  ) public returns (uint256) {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();

    console.log(tokenId);

    _mint(msg.sender, tokenId);

    NFToken newcon = new NFToken(name, symbol);

    websites[tokenId] = WebSite(address(newcon), title, content, coverURL);

    emit NewWebsite(tokenId, address(newcon), msg.sender);

    return tokenId;
  }
}

contract NFToken is ERC721, Pausable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    transferOwnership(tx.origin);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function safeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function mint() public {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }
}
