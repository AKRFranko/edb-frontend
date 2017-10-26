class IronMultiAjax extends Polymer.Element {
  static get is() {
    return 'iron-multi-ajax';
  }

  static get properties() {
    return {
      urls: Array,
      auto: {
        type: Boolean,
        value: false,
      },
      method: String,
      headers: Object,
      loading: {
        type: Boolean,
        value: false,
        notify: true,
      },
      handleAs: {
        type: String,
        value: 'json',
      },
      contentType: String,
      bodies: Array,
      sync: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get observers() {
    return ['_requestOptionsChanged(urls, method, headers, auto, handleAs)'];
  }

  generateRequest() {
    this.loading = true;

    if (this.urls) {
      const promises = this.urls.map((url, key) => {
        this.ironRequest = document.createElement('iron-request');
        Polymer.dom(this.root).appendChild(this.ironRequest);

        const params = {
          url,
          method: this.method,
          headers: this.headers,
          handleAs: this.handleAs,
        };

        if (this.contentType) {
          params.headers['content-type'] = this.contentType;
        }

        if (this.bodies && this.bodies.length > 0 && this.bodies[key]) {
          params.body = this.bodies[key];
        }

        if (this.sync) {
          return { ironRequest: this.ironRequest, params };
        }

        return this.ironRequest.send(params);
      });

      if (this.sync) {
        const responses = [];
        async.eachSeries(
          promises,
          (ironRequestObject, cb) => {
            ironRequestObject.ironRequest
              .send(ironRequestObject.params)
              .then((response) => {
                responses.push(response.response);
                cb();
              })
              .catch(cb);
          },
          (error) => {
            if (error) {
              this.loading = false;
              this.dispatchEvent(new CustomEvent('error', { error }));
            } else {
              this.loading = false;
              this.dispatchEvent(new CustomEvent('response', { detail: { response: responses } }));
            }
            this._cleanRequestElement();
          }
        );
      } else {
        Promise.all(promises)
          .then((responses) => {
            const responsesData = responses.map(response => response.response);
            this.loading = false;
            this.dispatchEvent(
              new CustomEvent('response', { detail: { response: responsesData } })
            );
            this._cleanRequestElement();
          })
          .catch((error) => {
            this.loading = false;
            this.dispatchEvent(new CustomEvent('error', { error }));
            this._cleanRequestElement();
          });
      }
    }
  }

  _cleanRequestElement() {
    const ironRequest = Polymer.dom(this.root).querySelector('iron-request');
    if (ironRequest) {
      Polymer.dom(this.root).removeChild(ironRequest);
    }
  }

  _requestOptionsChanged() {
    if (this.auto) {
      this.generateRequest();
    }
  }
}

customElements.define(IronMultiAjax.is, IronMultiAjax);
