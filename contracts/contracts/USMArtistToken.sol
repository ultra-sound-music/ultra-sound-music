// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract USMArtistToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // max num artists
    uint256 public constant ARTIST_CAP = 80;

    // track which addresses have minted artists
    mapping(address => bool) private hasMintedArtist;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function calculatePrice() public view returns (uint256) {
        return 150000000000000000; // 0.15 ETH
    }

    function createArtist(string memory uri)
        external
        payable
        returns (uint256)
    {
        require(_tokenIds.current() <= ARTIST_CAP, 'Max artist supply reached');
        require(
            !hasMintedArtist[msg.sender],
            'address has already minted an artist'
        );
        require(msg.value >= calculatePrice(), 'Ether value not enough');

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);
        hasMintedArtist[msg.sender] = true;
        return newTokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
