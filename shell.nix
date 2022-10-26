{ pkgs ? import <nixpkgs> {} }:

with pkgs;

mkShell {
  buildInputs = [
    yarn
    nodejs-16_x
    nodePackages.typescript-language-server
  ];
}
