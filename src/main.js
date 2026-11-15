// O engine (cópia intacta do scroll-craft) e o comportamento do site por cima dele.
import './vendor/scrollcraft.js';
import { iniciarBarra } from './surface/barra.js';

window.ScrollCraft.mount(document.body);
iniciarBarra();
