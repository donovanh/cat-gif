class CatGif extends HTMLElement {
  constructor() {
    super();
    this._images;
    this._catgif;
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        /* Styling scoped to the gif itself */
        img {
          border: 10px solid purple;
        }
      </style>
      <img id="catgif" src="" alt="Cat Gif" />
    `;
  }

  static get observedAttributes() {
    return ['keyword'];
  }

  connectedCallback() {
    // Fetch some gifs!
    this._fetchGifsAndShowRandom();
    this.catgif = this.shadowRoot.querySelector('#catgif');
    this.catgif.addEventListener('click', this.showRandom.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === 'keyword') {
      this._fetchGifsAndShowRandom();
    }
  }

  disconnectedCallback() {
    this.catgif.removeEventListener('click', this.showRandom);
  }

  async _fetchGifsAndShowRandom() {
    // Maybe use your own API key
    // https://developers.giphy.com/
    const key = 'gwWthNT5DFpvrh04kt4PYiakYO12aM3B';
    let keywords = `cat`;
    if (this.getAttribute('keyword')) {
      keywords += ` ${this.getAttribute('keyword')}`;
    }
    const url = `${window.location.protocol}//api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURI(keywords)}`;
    const result = await fetch(url);
    const JSONresult = await result.json();
    this._images = JSONresult.data.map(item => item.images.original.url)
    // Pick a random image from the 25 provided
    this.showRandom();
  }

  showRandom() {
    const image = this._images[Math.floor(Math.random()*this._images.length)];
    this.catgif.src = image;
  }
}

customElements.define('cat-gif', CatGif);