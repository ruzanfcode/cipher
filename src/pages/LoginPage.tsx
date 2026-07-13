import BrandMark from '../components/Common/BrandMark';

function LoginPage({ app }) {
  return (
    <main className="login-page">
      <div className="login-cardless">
        <div className="login-brand"><BrandMark large /></div>
        <h1>Sign in to <span>Cipher</span></h1>
        <p>Garment sentiment intelligence for design and merchandising teams.</p>
        <button className="primary-button login-button" type="button" onClick={app.login}>
          <span className="login-button__mark">M</span>
          Continue with MAS Account
        </button>
        <small>Access is managed through your organisation's MAS single sign-on.</small>
      </div>
    </main>
  );
}

export default LoginPage;
