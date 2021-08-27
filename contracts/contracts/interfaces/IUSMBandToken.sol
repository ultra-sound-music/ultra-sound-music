// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IUSMBandToken is IERC721 {
    function isBandMember(uint256 bandId, uint256 member)
        external
        view
        returns (bool);

    function isBandActive(uint256 bandId) external view returns (bool);
}
