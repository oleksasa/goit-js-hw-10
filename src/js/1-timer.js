import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let countdownInterval;
let startButton = document.querySelector('[data-start]');

const timerDays = document.querySelector('.timer [data-days]');

const timerHours = document.querySelector('.timer [data-hours]');

const timerMinutes = document.querySelector('.timer [data-minutes]');

const timerSeconds = document.querySelector('.timer [data-seconds]');

const toastOptions = {
  titleColor: '#FFFFFF',
  messageColor: '#FFFFFF',
  messageSize: '16px',
  position: 'topRight',
  displayMode: 'replace',
  closeOnEscape: true,
  pauseOnHover: false,
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Su'],
      longhand: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
  },
  onClose(selectedDates) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      timerDays.textContent = '00';
      timerHours.textContent = '00';
      timerMinutes.textContent = '00';
      timerSeconds.textContent = '00';
      startButton.disabled = false;
    }

    userSelectedDate = selectedDates[0];

    const now = new Date().getTime();
    if (userSelectedDate < now) {
      iziToast.show({
        class: 'js-izitoast-message',
        message: 'Please choose a date in the future',
        backgroundColor: '#FFA000',
        progressBarColor: '#FFE0AC',
        icon: 'icon-warning',
        class: 'custom-toast',
        ...toastOptions,
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer() {
  const now = new Date().getTime();
  const timeDifference = userSelectedDate - now;

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  timerDays.textContent = addLeadingZero(days);
  timerHours.textContent = addLeadingZero(hours);
  timerMinutes.textContent = addLeadingZero(minutes);
  timerSeconds.textContent = addLeadingZero(seconds);

  if (timeDifference <= 0) {
    timerDays.textContent = '00';
    timerHours.textContent = '00';
    timerMinutes.textContent = '00';
    timerSeconds.textContent = '00';
    clearInterval(countdownInterval);
    iziToast.show({
      title: 'Time Expired',
      message: 'The countdown has reached zero!',
      backgroundColor: '#59A10D',
      progressBarColor: '#B5EA7C',
      icon: 'icon-chek',
      class: 'custom-toast',
      ...toastOptions,
    });
    startButton.disabled = true;
  }
}

startButton.addEventListener('click', () => {
  if (userSelectedDate) {
    countdownInterval = setInterval(updateTimer, 1000);
    startButton.disabled = true;
  } else {
    iziToast.show({
      title: 'Select Date',
      message: 'Please select a date first.',
      backgroundColor: '#FFA000',
      progressBarColor: '#FFE0AC',
      icon: 'icon-warning',
      class: 'custom-toast',
      ...toastOptions,
    });
  }
});
