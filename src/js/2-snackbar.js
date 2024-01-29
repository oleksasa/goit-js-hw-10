import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const toastOptions = {
  messageColor: '#FFFFFF',
  titleColor: '#FFFFFF',
  messageSize: '16px',
  position: 'topRight',
  displayMode: 'replace',
  closeOnEscape: true,
  pauseOnHover: false,
};

document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();

  const delay = parseInt(document.querySelector('input[name="delay"]').value);
  const state = document.querySelector('input[name="state"]:checked').value;

  document.querySelector('.form').reset();

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.show({
        title: `Ok`,
        message: `Fulfilled promise in ${delay} ms`,
        backgroundColor: '#59A10D',
        progressBarColor: '#B5EA7C',
        icon: 'icon-chek',
        class: 'custom-toast',
        ...toastOptions,
      });
    })
    .catch(delay => {
      iziToast.show({
        title: 'Error',
        message: `Rejected promise in ${delay} ms`,
        backgroundColor: '#EF4040',
        progressBarColor: '#B51B1B',
        icon: 'icon-bi_x-octagon',
        class:'custom-toast',
        ...toastOptions,
      });
    });
});
