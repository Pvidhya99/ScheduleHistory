export const version = '2.10.2';
export const navbarBreakPoint = 'xl'; // Vertical navbar breakpoint
export const topNavbarBreakpoint = 'lg';
export const settings = {
  isFluid: true,
  isRTL: false,
  isDark: false,
  isTopNav: true,
  isVertical: true,
  get isCombo() {
    return this.isVertical && this.isTopNav;
  },
  showBurgerMenu: false, // controls showing vertical nav on mobile
  currency: '$',
  isNavbarVerticalCollapsed: false,
  navbarStyle: 'transparent',
  };
const config = { 
  version, 
  navbarBreakPoint, 
  topNavbarBreakpoint, 
  settings 
}
export default config;
