import app from '@store/app';
import usm from '@store/usm';
import web3 from '@store/web3';
import playback from '@store/playback';
import ui from '@store/ui';

// app
export const initApp = app.actions.init;

// web3
export const initWeb3 = web3.actions.init;
export const connectWallet = web3.actions.connectWallet;

// usm
export const initUsm = usm.actions.init;

// playback
export const initPlayback = playback.actions.init;

// ui
export const showModal = ui.actions.showModal;
export const showInstallWalletModal = ui.actions.showInstallWalletModal;
export const showAppMessage = ui.actions.showAppMessage;
