/* eslint-disable */
let bszCaller, bszTag, scriptTag, ready

let intervalId;
let executeCallbacks;
let onReady;
let isReady = false;
let callbacks = [];

// 修复Node同构代码的问题
if (typeof document !== 'undefined') {
  ready = function (callback) {
    if (isReady || document.readyState === 'interactive' || document.readyState === 'complete') {
      callback.call(document);
    } else {
      callbacks.push(function () {
        return callback.call(this);
      });
    }
    return this;
  };

  executeCallbacks = function () {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(document);
    }
    callbacks = [];
  };

  onReady = function () {
    if (!isReady) {
      isReady = true;
      executeCallbacks.call(window);
      if (document.removeEventListener) {
        document.removeEventListener('DOMContentLoaded', onReady, false);
      } else if (document.attachEvent) {
        document.detachEvent('onreadystatechange', onReady);
        if (window == window.top) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', onReady, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (/loaded|complete/.test(document.readyState)) {
        onReady();
      }
    });
    if (window == window.top) {
      intervalId = setInterval(function () {
        try {
          if (!isReady) {
            document.documentElement.doScroll('left');
          }
        } catch (e) {
          return;
        }
        onReady();
      }, 5);
    }
  }
}

bszCaller = {
  fetch: function (url, callback) {
    const callbackName = 'BusuanziCallback_' + Math.floor(1099511627776 * Math.random())
    url = url.replace('=BusuanziCallback', '=' + callbackName)
    scriptTag = document.createElement('SCRIPT');
    scriptTag.type = 'text/javascript';
    scriptTag.defer = true;
    scriptTag.src = url;
    scriptTag.referrerPolicy = "no-referrer-when-downgrade";
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    window[callbackName] = this.evalCall(callback)
  },
  evalCall: function (callback) {
    return function (data) {
      ready(function () {
        try {
          callback(data);
          if (scriptTag && scriptTag.parentElement && scriptTag.parentElement.contains(scriptTag)) {
            scriptTag.parentElement.removeChild(scriptTag);
          }
        } catch (e) {
          // console.log(e);
          // bszTag.hides();
        }
      })
    }
  }
}

const REQUEST_TIMEOUT = 4000
const MAX_ATTEMPTS = 3

const fetch = (options) => {
  const opts = {
    sitePvBase: Number(options && options.sitePvBase) || 0,
    siteUvBase: Number(options && options.siteUvBase) || 0
  }
  if (bszTag) {
    bszTag.hides();
    // 先用配置的基数占位，避免接口失败或缓慢时数字空白
    bszTag.fallbacks(opts);
  }

  let attempt = 0
  let settled = false

  // 不蒜子服务偶发 502，失败后重试；全部失败则至少展示配置的基数
  const request = () => {
    attempt++
    const timer = setTimeout(() => {
      if (settled) {
        return
      }
      if (attempt < MAX_ATTEMPTS) {
        request()
      } else {
        settled = true
        bszTag.fallbacks(opts)
      }
    }, REQUEST_TIMEOUT)

    bszCaller.fetch(
      '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback&_=' + Date.now(),
      function (data) {
        if (settled) {
          return
        }
        settled = true
        clearTimeout(timer)
        bszTag.texts(data, opts)
        bszTag.shows()
      }
    )
  }

  request()
}

bszTag = {
  bszs: ['site_pv', 'page_pv', 'site_uv'],
  texts: function (data, options) {
    const bases = {
      site_pv: (options && options.sitePvBase) || 0,
      site_uv: (options && options.siteUvBase) || 0
    }
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_value_' + key)
      if (elements) {
        const real = Number(data && data[key])
        const value = (Number.isFinite(real) ? real : 0) + (bases[key] || 0)
        for (var element of elements) {
          element.innerHTML = value.toLocaleString()
        }
      }
    })
  },
  fallbacks: function (options) {
    const bases = {
      site_pv: (options && options.sitePvBase) || 0,
      site_uv: (options && options.siteUvBase) || 0
    }
    for (const key of Object.keys(bases)) {
      if (!bases[key]) {
        continue
      }
      const values = document.getElementsByClassName('busuanzi_value_' + key)
      for (const value of values) {
        value.innerHTML = bases[key].toLocaleString()
      }
      const containers = document.getElementsByClassName('busuanzi_container_' + key)
      for (const container of containers) {
        container.style.display = 'inline'
      }
    }
  },
  hides: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'none';
        }
      }
    })
  },
  shows: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'inline';
        }
      }
    })
  }
}

module.exports = {
  fetch
}
