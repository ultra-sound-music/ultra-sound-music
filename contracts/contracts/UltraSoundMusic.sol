// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UltraSoundMusic is ERC1155 {
    using Counters for Counters.Counter;

    //prefix for band NFTs
    uint256 public constant BAND_PREFIX = 100;

    // prefix for track NFTs
    uint256 public constant TRACK_PREFIX = 100000;

    // max num artists
    uint256 public constant ARTIST_CAP = 80;

    uint256[] internal allArtistTokens;
    uint256[] internal allBandTokens;
    uint256[] internal allTrackTokens;

    mapping(address => bool) private hasMintedArtist;

    mapping(uint256 => string) public MetadataUris;

    //if band has sufficient members can be minted
    mapping(uint256 => uint256) private bandAttestations;

    //band members
    mapping(uint256 => mapping(uint256 => bool)) private bandMembers;

    // who is the leadder of the band
    mapping(uint256 => address) private bandLeaders;

    // has a member of a band minted a track on behalf of the band
    mapping(uint256 => mapping(uint256 => bool)) private mintedTracks;

    // events

    event bandCreate(uint256 id, uint256 artistId, address owner);
    event bandJoined(uint256 id, uint256 artistId, address owner);
    event trackCreated(
        uint256 trackId,
        uint256 bandId,
        uint256 artistId,
        address owner
    );

    Counters.Counter private _artistTokenIds;
    Counters.Counter private _bandTokenIds;
    Counters.Counter private _trackTokenIds;

    constructor() ERC1155("https://token.example/type/{id}.json") {}

    // return current number of artists

    function artistCount() public view returns (uint256) {
        return _artistTokenIds.current();
    }

    //does the msg.sender own the artist token they are attesting to own

    function _ownsArtist(uint256 artistId) private returns (bool) {
        return balanceOf(msg.sender, artistId) > 0;
    }

    //does the band have 4 members

    function _isBandMintable(uint256 bandId) private returns (bool) {
        return bandAttestations[bandId] == 4;
    }

    // can the band currently be joined

    function _isBandJoinable(uint256 bandId) private returns (bool) {
        return bandAttestations[bandId] > 0;
    }

    // is an artist a member of the specified band

    function _isBandMember(uint256 bandId, uint256 member)
        private
        returns (bool)
    {
        return bandMembers[bandId][member];
    }

    // has a member of a band minted a track

    function _hasMintedTrack(uint256 bandId, uint256 member)
        private
        returns (bool)
    {
        return mintedTracks[bandId][member];
    }

    /*
     * @dev can only mint 80 artist tokens
     */

    function createArtist(string memory _uri) public returns (uint256) {
        require(
            _artistTokenIds.current() < ARTIST_CAP,
            "Max artist supply reached"
        );
        require(
            !hasMintedArtist[msg.sender],
            "adddress has already minted an artist"
        );
        _artistTokenIds.increment();
        uint256 newTokenId = _artistTokenIds.current();
        _mint(msg.sender, newTokenId, 1, "");
        MetadataUris[newTokenId] = _uri;
        allArtistTokens.push(newTokenId);
        hasMintedArtist[msg.sender] = true;
        return newTokenId;
    }

    /*
     * @dev function to start a band, must provide artistId that you own, and partialId
     */

    function startBand(uint256 artistId, string memory _uri)
        public
        returns (uint256)
    {
        require(_ownsArtist(artistId), "you do not own the specified artist");
        _bandTokenIds.increment();
        uint256 bandId = BAND_PREFIX + _bandTokenIds.current();
        require(!_isBandJoinable(bandId), "this band is already active");
        bandLeaders[bandId] = msg.sender;
        MetadataUris[bandId] = _uri;
        bandAttestations[bandId] = 1;
        bandMembers[bandId][artistId] = true;
        emit bandCreate(bandId, artistId, msg.sender);
        return bandId;
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
        require(!_isBandMintable(bandId), "this band is already active");

        uint256 numAttest = bandAttestations[bandId];
        bandAttestations[bandId] += 1;
        bandMembers[bandId][artistId] = true;
        emit bandJoined(bandId, artistId, msg.sender);
        if (numAttest + 1 == 4) {
            _mint(bandLeaders[bandId], bandId, 1, "");
        }
        return bandId;
    }

    /*
     *checks if msg.sender owns artist iid that is sent, checks that artist hasn't minted track for band
     * checks that artist in band
     *
     */

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

        _trackTokenIds.increment();
        uint256 newTokenId = TRACK_PREFIX + _trackTokenIds.current();
        _mint(msg.sender, newTokenId, 1, "");
        MetadataUris[newTokenId] = _uri;
        allTrackTokens.push(newTokenId);
        emit trackCreated(newTokenId, bandId, artistId, msg.sender);
        return newTokenId;
    }

    // @dev returns the URI for a requested tokenID

    function uri(uint256 _id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return MetadataUris[_id];
    }
}
