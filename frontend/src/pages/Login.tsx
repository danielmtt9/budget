const Login = () => {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-start sm:justify-center antialiased bg-background-light dark:bg-background-dark overflow-y-auto py-12">
      <div className="w-full max-w-md px-4 sm:px-0">
        <header className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_535)">
                  <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_535">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">BudgetWise</h2>
          </div>
        </header>
        <main className="w-full bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-10">
          <div className="flex flex-col gap-2 mb-8 text-center">
            <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-800 dark:text-white">Welcome Back</p>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Enter your credentials to access your account.</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                <p className="text-sm font-medium leading-normal pb-2 text-slate-600 dark:text-slate-300">Email</p>
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal" placeholder="you@example.com" type="email" />
              </label>
              <label className="flex flex-col">
                <p className="text-sm font-medium leading-normal pb-2 text-slate-600 dark:text-slate-300">Password</p>
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal" placeholder="Enter your password" type="password" />
              </label>
            </div>
            <div className="flex flex-col gap-4">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                <span className="truncate">Login</span>
              </button>

              <a href={`${import.meta.env.DEV ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8002' : `http://${window.location.hostname}:8002`) : ''}/login`} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-base font-medium leading-normal hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                    <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                    <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
                    <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
                  </svg>
                  <span className="truncate">Login with Google</span>
                </div>
              </a>

              <a href={`${import.meta.env.DEV ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8002' : `http://${window.location.hostname}:8002`) : ''}/dev/login?email=test@example.com`} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                <span className="truncate">Dev Login (Test User)</span>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
