**DEV mode:**

1) Then run npm run install:all still inside the top level directory. It also sets up the git hook that runs the
   frontend's lint and unit tests before each push (skip it with git push --no-verify)
2) Finally run npm run dev to launch the app (both frontend and backend) in dev mode

**PROD mode:**

1) Same as above
2) Run npm run preview:local to test a production build locally (http://localhost:4173), with the development
settings: npm run preview uses the production ones, with which signing in only works on onlineresume.dev
