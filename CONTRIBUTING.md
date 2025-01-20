# Project MAP - Contributing

- Fork the Repository
  - Click on the `Fork` button at the top-right of this repository.
- Clone Your Fork in Local Environment
  - Use `git clone` command
- Setup the Project in Local Environment
  - Check [`SETUP.md`](./SETUP.md)
- Make Your Changes in Code base
  - Follow the project's coding standards and best practices.
- Make sure to Update [`Change Log.txt`](./Change%20Log.txt)
  - Increment +1 only in last 2 element. Like: Current - `1.0.0.1` ; Change to - `1.0.1.2`
  - Add `A. BUG FIXES`, `B. CHANGES`, `C. NEW FEATURES`
- Update [`package.json`](./package.json)
  - Change the `version` same way like previous one.
- Add Your Name & Details in [`CONTRIBUTORS.md`](./CONTRIBUTORS.md) under `Contributors`
  - Example:
    ```
    - **[Ritwik Satptati](https://github.com/your-username)** : Project creator and maintainer
      - [Linkedin: @ritwik-satpati](https://www.linkedin.com/in/ritwik-satpati/)
      - [Github: @ritwik-satpati](https://github.com/ritwik-satpati)
      - [X (Twitter): @ritwik_satpati](https://twitter.com/ritwik_satpati)
    ```
- Delete `package-lock.json` file & `node_modules` folder
- Commit Your Changes
  - Write clear and concise commit messages:
    `git commit -m "<Fix: Issue description or Add: Feature description>"`
- Push Your Changes
  - Push your branch to your fork:
    `git push origin`
- Submit a Pull Request
  - Go to your updated forked repository on GitHub and click the `New Pull Request` button with title as `<Fix: Issue description or Add: Feature description>` and message as what is updated `Change Log.txt`.
