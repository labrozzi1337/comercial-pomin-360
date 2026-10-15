import './style.css';
import { iniciarCena } from './scene';
import { iniciarUI } from './ui';
import { iniciarCalc } from './calc';
import { iniciarMovimento } from './motion';

// Ordem importa: a UI monta o DOM (trilho, falas, cards) que o movimento anima depois.
const cena = iniciarCena(document.getElementById('webgl') as HTMLCanvasElement);
const calc = iniciarCalc();
const mov = { goto: (_: string) => {}, travar: (_: boolean) => {}, refresh: () => {} };
iniciarUI({ cena, calc: { aplicar: n => calc.aplicar(n) }, goto: s => mov.goto(s), travar: on => mov.travar(on), refresh: () => mov.refresh() });
Object.assign(mov, iniciarMovimento(cena));
