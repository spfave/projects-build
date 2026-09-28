FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install applications
RUN apt-get update && apt-get install -y \
	zsh \
	git \
	neovim \
	bat \
	eza \
	fd-find \
	fzf \
	ripgrep \
	stow \
	zoxide \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# Install mise
RUN curl https://mise.run | MISE_INSTALL_PATH="/usr/local/bin/mise" sh

# Set default shell
SHELL ["/bin/zsh", "-c"]
