import React, { useEffect } from 'react';
import userImage from '../../assets/images/user.svg';
import { api } from '../../utils';
import './index.scss';
import useStore from '../../store';

function Login(props) {
  const { showLogin } = props;
  const method = 'POST';
  const credentials = 'include';

  const { user, setStoreUser } = useStore();

  useEffect(() => {

  }, []);

  return (
    <div className={`login ${showLogin ? '' : 'hidden'}`.trim()}>

      <div className="login-user">
        <div className="login-user-info">
          <img className="login-user-info-image" src={user.photo || userImage} alt="profile" />
          <p className="login-user-info-name">{user.displayName || 'Username'}</p>
        </div>
        {user._id && (<a href="/user">My Account</a>)}
        {(user._id && user.admin) && (<a href="/admin">Admin</a>)}
        <button
          type="button"
          onClick={() => {
            if (user._id) {
              fetch(`${api}/auth/logout`, { method, credentials }).then(res => res.json()).then((res) => {
                if (!res.error) {
                  setStoreUser({ id: null, googleId: null, displayName: null, photo: null });
                }
              });
            } else location.replace(`${api}/auth/google`);
          }}
        >{user._id ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;

<button
  type="button"
  onClick={() => {

  }}
>Login
</button>;
