import i18n from './i18n/index';
import Toast from './Toast';

export default function AppUpdate(isCheckMax) {
  if (isCheckMax) {
    Toast(i18n.version_isNewest)
  }
}
