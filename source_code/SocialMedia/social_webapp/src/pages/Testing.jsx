import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyComponent = () => {
  const notify = () => toast("Wow so easy!");

  return (
    <div id='hoohoo'>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </div>
  );
}

export default MyComponent