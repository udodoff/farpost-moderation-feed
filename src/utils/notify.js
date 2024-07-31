import { createToast } from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import ToastNotification from '../components/ToastNotification/ToastNotification';

const notify = createToast({
    duration: 5000,
    theme: 'dark',
    className: 'toastNotification',
    clickClosable: true,
    position: 'top-right',
    maxVisibleToasts: 1,
    render: (message) => <ToastNotification text={message} />,
});

export default notify;
