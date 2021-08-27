// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract USMBandToken is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    address artistAddr;

    //if band has sufficient members can be minted
    mapping(uint256 => uint256) public bandAttestations;

    //band members
    mapping(uint256 => mapping(uint256 => bool)) public bandMembers;

    // who is the leadder of the band
    mapping(uint256 => address) private bandLeaders;

    event bandCreate(uint256 id, uint256 artistId, address owner);
    event bandJoined(uint256 id, uint256 artistId, address owner);

    constructor(
        string memory name,
        string memory symbol,
        address _artist
    ) ERC721(name, symbol) {
        artistAddr = _artist;
    }

    //does the msg.sender own the artist token they are attesting to own

    function _ownsArtist(uint256 artistId) internal view returns (bool) {
        return IERC721(artistAddr).ownerOf(artistId) == msg.sender;
    }

    function _isBandJoinable(uint256 bandId) internal view returns (bool) {
        return bandAttestations[bandId] < 6;
    }

    function isBandMember(uint256 bandId, uint256 member)
        public
        view
        returns (bool)
    {
        return bandMembers[bandId][member];
    }

    function isBandActive(uint256 bandId) public view returns (bool) {
        return bandAttestations[bandId] >= 2;
    }

    /*
     * @dev function to start a band, must provide artistId that you own, and partialId
     */

    function startBand(uint256 artistId, string memory _uri)
        public
        returns (uint256)
    {
        require(_ownsArtist(artistId), "you do not own the specified artist");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        bandLeaders[newTokenId] = msg.sender;
        bandAttestations[newTokenId] = 1;
        bandMembers[newTokenId][artistId] = true;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _uri);
        emit bandCreate(newTokenId, artistId, msg.sender);
        return newTokenId;
    }

    /*
     * @dev function for msg.sender to join band, can't currently be in specified band,
      band must be inactive. if this is 4th vote active band for minting
     */

    function joinBand(uint256 artistId, uint256 bandId)
        public
        returns (uint256)
    {
        require(_ownsArtist(artistId), "you do not own the specified artist");
        require(_isBandJoinable(bandId), "this band is already active");
        require(_exists(bandId), "this band does not exist");
        uint256 numAttest = bandAttestations[bandId];
        bandAttestations[bandId] += 1;
        bandMembers[bandId][artistId] = true;
        emit bandJoined(bandId, artistId, msg.sender);
        return bandId;
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
