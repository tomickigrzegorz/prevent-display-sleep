window.addEventListener('DOMContentLoaded', () => {

  let wakeLockSentinel = null;
  const text = document.querySelector('.info');
  const more = document.querySelector('.more-less');
  const root = document.querySelector('input');

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        // Detect if Screen Wake Lock API is available
        text.textContent = 'supported';

        // Enable Screen Wake Lock API
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        text.textContent = 'active';

        // Add event listener for when Screen Wake Lock API is released
        wakeLockSentinel.addEventListener('release', () => {
          text.textContent = 'released';
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      text.textContent = `${err}`;
    }
  };

  requestWakeLock();

  // const fetchData = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.text();
  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  const createIframe = (url) => {
    let iframe = document.querySelector('iframe');
    iframe.src = 'about:blank';

    const api = `/grab-site.php?url=${url}`;
    axios.post(api)
      .then(response => {
        iframe.contentWindow.document.write(response.data);
      });
    // fetchData(api)
    //   .then(data => iframe.contentWindow.document.write(data));
  }

  const loadSite = () => {
    if (root.value.length > 0) {
      createIframe(root.value.trim());
    } else {
      emptyInput();
    }
  }

  const emptyInput = () => {
    root.classList.add('error');
    root.placeholder = 'required field'
  }

  const clearData = document.querySelector('.clear-data');

  root.addEventListener('input', (event) => {
    if (event.target.value.length > 0) {
      root.classList.remove('error');
      clearData.style.display = 'flex';
    }
  })

  const addSiteToLocalstore = () => {
    if (root.value.length > 0) {
      addToLocalStorageArray('sites', root.value.trim());
      showSites();
    }
  };

  const addToLocalStorageArray = (name, value) => {
    let existing = localStorage.getItem(name);

    existing = existing ? existing.split(',') : [];
    existing.push(JSON.stringify(value));
    localStorage.setItem(name, existing);
  };

  const getCountElement = () => {
    const local = localStorage.getItem('sites');
    const array = local ? local.split(',') : local;
    return array;
  }

  const countItems = () => {
    const array = getCountElement();
    const count = document.querySelector('.count');
    count.textContent = array ? `${array.length}` : 0;

    if (array?.length <= 0) {
      document.querySelector('.sites').classList.remove('is-active');
      more.textContent = '↑ show list';
    }
  }

  const showSites = () => {
    const array = getCountElement();
    const siteContainer = document.querySelector('.site-container');

    siteContainer.innerHTML = '';

    countItems();

    if (array?.length <= 0) return;

    const test = array?.reverse().map(item => {
      return `
        <div class="item-element">
          <div class="site-item">${JSON.parse(item)}</div>
          <div class="delete">
            <svg class="trash">
              <use xlink:href="#icon-bin"></use>
            </svg>
          </div>
        </div>`
    }).join('');

    siteContainer.insertAdjacentHTML('afterbegin', test);
  };

  showSites();


  const showMoreLess = (element) => {
    const array = getCountElement();
    if (array.length > 0) {
      element.classList.toggle('is-active');
      more.textContent = more.textContent === '↑ show list' ? '↓ hide list' : '↑ show list';
    }
  }

  const deleteELement = (link) => {
    const array = getCountElement();
    const filtered = array.filter((value) => JSON.parse(value) !== link);

    localStorage.clear();
    localStorage.setItem('sites', filtered.toString());

    showSites();
  }

  document.addEventListener('click', (event) => {
    const { target } = event;
    event.preventDefault();

    if (target.className === 'load') {
      loadSite();
    }
    if (target.parentNode.className === 'more' || target.className === 'more') {
      showSites();
      showMoreLess(target.closest('.sites'));
    }
    if (target.className === 'delete') {
      deleteELement(target.previousElementSibling.textContent);
    }
    if (target.className === 'add-site') {
      addSiteToLocalstore();
    }
    if (target.className === 'clear-data') {
      root.value = '';
      clearData.removeAttribute('style');
    }
    if (target.className === 'site-item') {
      createIframe(target.textContent);
      showMoreLess(target.closest('.sites'));
    }
  }, false)

})