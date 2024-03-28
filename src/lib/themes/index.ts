import andromeda from 'tm-themes/themes/andromeeda.json';
import catppuccinLatte from 'tm-themes/themes/catppuccin-latte.json';
import catppuccinMocha from 'tm-themes/themes/catppuccin-mocha.json';
import githubDark from 'tm-themes/themes/github-dark.json';
import githubLight from 'tm-themes/themes/github-light.json';
import materialThemeOcean from 'tm-themes/themes/material-theme-ocean.json';
import poimandres from 'tm-themes/themes/poimandres.json';
import slackOchin from 'tm-themes/themes/slack-ochin.json';
import vitesseLight from 'tm-themes/themes/vitesse-light.json';

export const lightThemes = [
  catppuccinLatte,
  githubLight,
  slackOchin,
  vitesseLight,
];
export const darkThemes = [
  andromeda,
  catppuccinMocha,
  githubDark,
  materialThemeOcean,
  poimandres,
];

export const editorThemes = [...lightThemes, ...darkThemes];
