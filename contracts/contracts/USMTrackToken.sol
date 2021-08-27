// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IUSMBandToken.sol";

contract USMTrackToken is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    address artistAddr;
    address bandAddr;

    // has a member of a band minted a track on behalf of the band
    mapping(uint256 => mapping(uint256 => bool)) private mintedTracks;

    event trackCreated(
        uint256 trackId,
        uint256 bandId,
        uint256 artistId,
        address owner
    );

    constructor(
        string memory name,
        string memory symbol,
        address _artist,
        address _band
    ) ERC721(name, symbol) {
        artistAddr = _artist;
        bandAddr = _band;
    }

    //does the msg.sender own the artist token they are attesting to own

    function _ownsArtist(uint256 artistId) internal view returns (bool) {
        return IERC721(artistAddr).ownerOf(artistId) == msg.sender;
    }

    // is an artist a member of the specified band

    function _isBandMember(uint256 bandId, uint256 member)
        internal
        view
        returns (bool)
    {
        return IUSMBandToken(bandAddr).isBandMember(bandId, member);
    }

    // is an artist a member of the specified band

    function _isBandActive(uint256 bandId) internal view returns (bool) {
        return IUSMBandToken(bandAddr).isBandActive(bandId);
    }

    // has a member of a band minted a track

    function _hasMintedTrack(uint256 bandId, uint256 member)
        private
        returns (bool)
    {
        return mintedTracks[bandId][member];
    }

    function createTrack(
        uint256 artistId,
        uint256 bandId,
        string memory _uri
    ) public returns (uint256) {
        require(_ownsArtist(artistId), "you do not own the specified artist");
        require(_isBandMember(bandId, artistId), "you're not in the band");
        require(
            !_hasMintedTrack(bandId, artistId),
            "artist already minted track"
        );
        require(_isBandActive(bandId), "this band is not active");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _uri);
        mintedTracks[bandId][artistId] = true;
        emit trackCreated(newTokenId, bandId, artistId, msg.sender);
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
