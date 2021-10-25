const { expect } = require('chai');
const { waffle, ethers } = require('hardhat');
const provider = waffle.provider;

const testURI = 'http://ipfs.io/ipfs/test';
const testBandMetadata =
  'https://storageapi.fleek.co/dongambas-team-bucket/1625349161380';
const testTrackMetadata =
  'https://storageapi.fleek.co/dongambas-team-bucket/1625349236642';
const nullAddress = '0x0000000000000000000000000000000000000000';

describe('test USM tokens', async () => {
  const [deployer, wallet1, wallet2, wallet3, wallet4] =
    await provider.getWallets();

  let factory_USMArtistToken,
    factory_USMBandToken,
    factory_USMTrackToken,
    USMA,
    USMB,
    USMT;

  before('deploy contracts', async () => {
    factory_USMArtistToken = await ethers.getContractFactory('USMArtistToken');
    factory_USMBandToken = await ethers.getContractFactory('USMBandToken');
    factory_USMTrackToken = await ethers.getContractFactory('USMTrackToken');

    USMA = await factory_USMArtistToken
      .connect(deployer)
      .deploy('USM Artist Token', 'USM-A');
    await USMA.deployTransaction.wait();
    USMB = await factory_USMBandToken
      .connect(deployer)
      .deploy('USM Band Token', 'USM-B', USMA.address);
    await USMB.deployTransaction.wait();
    USMT = await factory_USMTrackToken
      .connect(deployer)
      .deploy('USM Track Token', 'USM-T', USMA.address, USMB.address);
    await USMT.deployTransaction.wait();
  });

  it('should have owner equal to the deployer address', async () => {
    const usmaOwner = await USMA.owner();
    expect(usmaOwner).to.eq(deployer.address);
  });

  it('should mint an artist tokens for wallet 1-4', async () => {
    const USMA_w1 = factory_USMArtistToken
      .connect(wallet1)
      .attach(USMA.address);
    const USMA_w2 = factory_USMArtistToken
      .connect(wallet2)
      .attach(USMA.address);
    const USMA_w3 = factory_USMArtistToken
      .connect(wallet3)
      .attach(USMA.address);
    const USMA_w4 = factory_USMArtistToken
      .connect(wallet4)
      .attach(USMA.address);

    await USMA_w1.createArtist(testURI, {
      value: ethers.utils.parseEther('.15')
    });
    await USMA_w2.createArtist(testURI, {
      value: ethers.utils.parseEther('.15')
    });
    await USMA_w3.createArtist(testURI, {
      value: ethers.utils.parseEther('.15')
    });
    await USMA_w4.createArtist(testURI, {
      value: ethers.utils.parseEther('.15')
    });

    const b1 = await USMA.balanceOf(wallet1.address);
    const b2 = await USMA.balanceOf(wallet2.address);
    const b3 = await USMA.balanceOf(wallet3.address);
    const b4 = await USMA.balanceOf(wallet4.address);

    const bC = await provider.getBalance(USMA.address);

    expect(bC).to.eq(ethers.utils.parseEther('.60'));
    expect(b1).to.eq(1);
    expect(b2).to.eq(1);
    expect(b3).to.eq(1);
    expect(b4).to.eq(1);
  });

  it('should start a band from the first wallet', async () => {
    const USMA_w1 = factory_USMArtistToken
      .connect(wallet1)
      .attach(USMA.address);
    const artistId = await USMA_w1.tokenOfOwnerByIndex(wallet1.address, 0);
    const USMB_w1 = factory_USMBandToken.connect(wallet1).attach(USMB.address);
    await expect(USMB_w1.startBand(artistId, testBandMetadata))
      .to.emit(USMB_w1, 'bandCreate')
      .withArgs(1, artistId, wallet1.address);
  });

  it('should join a band with wallet 2-4 and mint a band token', async () => {
    const USMA_w2 = factory_USMArtistToken
      .connect(wallet2)
      .attach(USMA.address);
    const USMA_w3 = factory_USMArtistToken
      .connect(wallet3)
      .attach(USMA.address);
    const USMA_w4 = factory_USMArtistToken
      .connect(wallet4)
      .attach(USMA.address);

    const artistId_2 = await USMA_w2.tokenOfOwnerByIndex(wallet2.address, 0);
    const artistId_3 = await USMA_w3.tokenOfOwnerByIndex(wallet3.address, 0);
    const artistId_4 = await USMA_w4.tokenOfOwnerByIndex(wallet4.address, 0);

    const USMB_w2 = factory_USMBandToken.connect(wallet2).attach(USMB.address);
    const USMB_w3 = factory_USMBandToken.connect(wallet3).attach(USMB.address);
    const USMB_w4 = factory_USMBandToken.connect(wallet4).attach(USMB.address);

    // on 2nd member joining a band join event is emitted

    await expect(USMB_w2.joinBand(artistId_2, 1))
      .to.emit(USMB_w2, 'bandJoined')
      .withArgs(1, artistId_2, wallet2.address);

    // on 3rd member joining a band join event is emitted

    await expect(USMB_w3.joinBand(artistId_3, 1))
      .to.emit(USMB_w3, 'bandJoined')
      .withArgs(1, artistId_3, wallet3.address);

    // on 4th member joining band is created and minted to band leader

    await expect(USMB_w4.joinBand(artistId_4, 1))
      .to.emit(USMB_w4, 'bandJoined')
      .withArgs(1, artistId_4, wallet4.address);
  });

  it('should mint a track from wallet 1', async () => {
    const USMT_w1 = factory_USMTrackToken.connect(wallet1).attach(USMT.address);

    // on create track a trackCreated event is emitted

    await expect(USMT_w1.createTrack(1, 1, testURI))
      .to.emit(USMT_w1, 'trackCreated')
      .withArgs(1, 1, 1, wallet1.address);
  });
});
