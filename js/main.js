'use strict';

const Portfolio = function() {
	this.sessoes = $('.portfolio-sessao');
	this.sessoesBotoes = $('.nav-lista__item');
	this.sessaoAtual = '';
	
	this.tela = {
		altura: 0,
		scrollTopo: 0,

		portfolio: {
			slideLargura: 0
		}
	};
	
	this.headerSobreConteudoAtivado = false;

	this.portfolioSlideItens = $('#portfolio .portfolio-slide__item');
	this.portfolioSlideAtualId = 0;
	this.portfolioSlideDescricaoUltimoId = -1;

	this.podeUsarScroll = true;

	this.sobreJaAtivado = false;
	this.portfolioJaAtivado = false;
	this.contatoJaAtivado = false;
};

Portfolio.prototype.atualizarInfoTela = function() {
	this.tela.altura = $(window).height();
	this.tela.scrollTopo = $(document).scrollTop();
	this.tela.portfolio.slideLargura = $('#portfolio .portfolio-slide').width();
};

Portfolio.prototype.atualizarEstadoHeader = function() {
	if (!this.headerSobreConteudoAtivado && this.tela.scrollTopo > 0) {
		this.headerSobreConteudoAtivado = true;
		$('.header').addClass('header--sobre-conteudo');
		$('#btnVoltarTopo').addClass('visivel');
	} else if (this.headerSobreConteudoAtivado && this.tela.scrollTopo <= 0) {
		this.headerSobreConteudoAtivado = false;
		$('.header').removeClass('header--sobre-conteudo');
		$('#btnVoltarTopo').removeClass('visivel');
	}
};

Portfolio.prototype.procurarSessaoSendoVisualizada = function() {
	for (var s = 0; s < this.sessoes.length; s++) {
		if (this.tela.scrollTopo + this.tela.altura / 2 < $(this.sessoes[s]).offset().top + $(this.sessoes[s]).height()) {
			
			var tmpId = $(this.sessoes[s]).attr('id');
			var sessaoAnterior;

			if (tmpId != this.sessaoAtual) {
				sessaoAnterior = this.sessaoAtual;
				this.sessaoAtual = tmpId;
			} else
				return;

			//this.aoSairDaSessao(sessaoAnterior);
			this.aoEntrarNaSessao(this.sessaoAtual);
			
			return;
		}
	}
};

Portfolio.prototype.limparBotoesSelecionados = function() {
	this.sessoesBotoes.removeClass('nav-lista__item--selecionado');
}

Portfolio.prototype.selecionarBotaoSessaoAtual = function(sessao) {
	for (var i = 0; i < this.sessoesBotoes.length; i++) {
		if ($(this.sessoesBotoes[i]).children('a').attr('href') == '#' + sessao) {
			
			$(this.sessoesBotoes[i]).addClass('nav-lista__item--selecionado');
			
			return;
		}
	}
}

Portfolio.prototype.atualizarParallax = function() {
	if (this.tela.scrollTopo > $('.portfolio-sessao#inicio').height())
		return;

	$('.portfolio-sessao#inicio').css('background-position', '0px ' + this.tela.scrollTopo / 2 + 'px');
	$('.portfolio-sessao#inicio img#logo, svg#logo').css('transform', 'translateY(' + this.tela.scrollTopo / 3 + 'px)'); 
	// $('.portfolio-sessao#inicio img#logo, svg#logo').css('opacity', 1.0 - this.tela.scrollTopo / this.tela.altura);
};

Portfolio.prototype.aoEntrarNaSessao = function(sessao) {
	this.limparBotoesSelecionados();
	this.selecionarBotaoSessaoAtual(sessao);

	switch (sessao) {
		case 'sobre':
			if (this.sobreJaAtivado)
				return;
			else
				this.sobreJaAtivado = true;

			$('.portfolio-sessao#sobre .separador-esquerda').addClass('separador-esquerda--visivel');
			$('.portfolio-sessao#sobre .separador-direita').addClass('separador-direita--visivel');
			break;
		case 'portfolio':
			if (this.portfolioJaAtivado)
				return;
			else
				this.portfolioJaAtivado = true;

			$('.portfolio-sessao#portfolio .portfolio-sessao__titulo').addClass('visivel');
			$('.portfolio-sessao#portfolio .portfolio-slide').addClass('visivel');
			break;
		case 'contato':
			if (this.contatoJaAtivado)
				return;
			else
				this.contatoJaAtivado = true;

			$('.portfolio-sessao#contato .portfolio-sessao__titulo').addClass('visivel');
			$('.portfolio-sessao#contato .portfolio-sessao__descricao').addClass('visivel');
			$('.portfolio-sessao#contato .portfolio-form').addClass('visivel');
			break;
	}
};

Portfolio.prototype.aoSairDaSessao = function(sessao) {
	switch (sessao) {
		case 'sobre':
			$('.portfolio-sessao#sobre .separador-esquerda').removeClass('separador-esquerda--visivel');
			$('.portfolio-sessao#sobre .separador-direita').removeClass('separador-direita--visivel');
			break;
		case 'portfolio':
			$('.portfolio-sessao#portfolio .portfolio-sessao__titulo').removeClass('visivel');
			$('.portfolio-sessao#portfolio .portfolio-slide').removeClass('visivel');
			break;
		case 'contato':
			$('.portfolio-sessao#contato .portfolio-sessao__titulo').removeClass('visivel');
			$('.portfolio-sessao#contato .portfolio-sessao__descricao').removeClass('visivel');
			$('.portfolio-sessao#contato .portfolio-form').removeClass('visivel');
			break;
	}
};

Portfolio.prototype.registrarEventos = function() {
	$('#btnSlideControleEsquerda').click(this.moverSlideEsquerda);
	$('#btnSlideControleDireita').click(this.moverSlideDireita);
	$('#btnSlideVerInfo').click(this.verInfoSlide);
	$('#btnSlideFecharInfo').click(this.fecharInfoSlide);
	$('#btnVoltarTopo').click(this.voltarTopo);

	for (var i = 0; i < this.sessoesBotoes.length; i++) {
		var anchor = $(this.sessoesBotoes[i]).children()[0];

		anchor.onclick = function(e) {
			e.preventDefault();

			portfolio.scrollPara($(this.hash).offset().top - $('header.header').height());
		};
	}
};

Portfolio.prototype.scrollPara = function(pos) {
	if (!portfolio.podeUsarScroll)
		return;

	portfolio.podeUsarScroll = false;

	$('html, body').animate({
		scrollTop: pos
	}, 500, undefined, function() {
		portfolio.podeUsarScroll = true;
	});
};

Portfolio.prototype.atualizarSlide = function(sessao) {
	if (this.portfolioSlideAtualId > 0) {
		for (var i = 0; i < this.portfolioSlideAtualId; i++) {
			$(this.portfolioSlideItens[i]).css('left', this.tela.portfolio.slideLargura * (i - this.portfolioSlideAtualId) + 'px');
			$(this.portfolioSlideItens[i]).css('transform', 'scale(.75)');
			$(this.portfolioSlideItens[i]).css('opacity', '0');
		}

		$('#btnSlideControleEsquerda').addClass('visivel');
	} else {
		// Desative o controle esquerdo
		$('#btnSlideControleEsquerda').removeClass('visivel');
	}

	if (this.portfolioSlideAtualId < this.portfolioSlideItens.length - 1) {
		for (var i = this.portfolioSlideAtualId; i < this.portfolioSlideItens.length; i++) {
			$(this.portfolioSlideItens[i]).css('left', this.tela.portfolio.slideLargura * (i - this.portfolioSlideAtualId) + 'px');
			$(this.portfolioSlideItens[i]).css('transform', 'scale(.75)');
			$(this.portfolioSlideItens[i]).css('opacity', '0');
		}

		$('#btnSlideControleDireita').addClass('visivel');
	} else {
		// Desative o controle direito
		$('#btnSlideControleDireita').removeClass('visivel');
	}

	$(this.portfolioSlideItens[this.portfolioSlideAtualId]).css('left', 0 + 'px');
	$(this.portfolioSlideItens[this.portfolioSlideAtualId]).css('transform', 'scale(1)');
	$(this.portfolioSlideItens[this.portfolioSlideAtualId]).css('opacity', '1');
};

Portfolio.prototype.moverSlideEsquerda = function() {
	if (portfolio.portfolioSlideAtualId - 1 >= 0) {
		portfolio.portfolioSlideAtualId--;
		
		$('#btnSlideControleEsquerda').css('animation', 'controleClicaEsquerda 200ms ease-out');
		
		setTimeout(function() {
			$('#btnSlideControleEsquerda').css('animation', 'none');
		}, 200);
		
		portfolio.aoModificarSlide();
	}
};

Portfolio.prototype.moverSlideDireita = function() {
	if (portfolio.portfolioSlideAtualId + 1 < portfolio.portfolioSlideItens.length) {
		portfolio.portfolioSlideAtualId++;

		$('#btnSlideControleDireita').css('animation', 'controleClicaDireita 200ms ease-out');

		setTimeout(function() {
			$('#btnSlideControleDireita').css('animation', 'none');
		}, 200);

		portfolio.aoModificarSlide();
	}
};

Portfolio.prototype.aoModificarSlide = function() {
	this.atualizarSlide();
};

Portfolio.prototype.verInfoSlide = function() {
	if (portfolio.portfolioSlideAtualId != portfolio.portfolioSlideDescricaoUltimoId) {
		$('#portfolio .portfolio-slide .portfolio-slide__tela-descricao #slideTitulo').text($(portfolio.portfolioSlideItens[portfolio.portfolioSlideAtualId]).attr('data-titulo'));
		$('#portfolio .portfolio-slide .portfolio-slide__tela-descricao #slideImagem').css('background-image', 'url(' + $(portfolio.portfolioSlideItens[portfolio.portfolioSlideAtualId]).attr('data-imagem') + ')');
		$('#portfolio .portfolio-slide .portfolio-slide__tela-descricao #slideDescricao').text($(portfolio.portfolioSlideItens[portfolio.portfolioSlideAtualId]).attr('data-descricao'));

		portfolio.portfolioSlideDescricaoUltimoId = portfolio.portfolioSlideAtualId;
	}

	$('#portfolio .portfolio-slide .portfolio-slide__tela-descricao').addClass('portfolio-slide__tela-descricao--visivel');
};

Portfolio.prototype.fecharInfoSlide = function() {
	$('#portfolio .portfolio-slide .portfolio-slide__tela-descricao').removeClass('portfolio-slide__tela-descricao--visivel');
};

Portfolio.prototype.voltarTopo = function() {
	$('#btnVoltarTopo').css('animation', 'btnCliquePadrao 200ms ease-out');
		
	setTimeout(function() {
		$('#btnVoltarTopo').css('animation', 'none');
	}, 200);

	portfolio.scrollPara(0);
};

const portfolio = new Portfolio();

$(document).scroll(function() {
	portfolio.atualizarInfoTela();
	
	portfolio.atualizarEstadoHeader();
	portfolio.procurarSessaoSendoVisualizada();
	portfolio.atualizarParallax();
});

$(window).resize(function() {
	portfolio.atualizarInfoTela();
	portfolio.atualizarSlide();
});

$(document).ready(function() {
	portfolio.atualizarInfoTela();

	portfolio.procurarSessaoSendoVisualizada();
	portfolio.atualizarSlide();

	portfolio.registrarEventos();
});