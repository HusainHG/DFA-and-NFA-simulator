# Jenkins CI/CD Setup Guide for AutomataStudio

This guide explains how to connect this repository ([`HusainHG/DFA-and-NFA-simulator`](https://github.com/HusainHG/DFA-and-NFA-simulator)) to **Jenkins** to automatically test, lint, build, and archive the project.

---

## 📋 What Has Been Added

1. **[`Jenkinsfile`](file:///e:/TOC/Jenkinsfile)** at the root of the repository:
   - **Cross-Platform Compatibility**: Automatically detects whether the Jenkins agent is running on Linux, macOS (`sh`), or Windows (`bat`).
   - **Environment Verification**: Inspects active Node.js and npm versions.
   - **Dependency Installation**: Runs `npm ci` (with fallback to `npm install`) for deterministic builds.
   - **Code Quality & Linting**: Executes `npm run lint` with Oxlint.
   - **Automated Tests**: Executes `npm test`.
   - **Production Compilation**: Executes `npm run build` using Vite.
   - **Artifact Validation**: Verifies that `./dist/index.html` was generated.
   - **Build Artifact Archiving**: Automatically archives the `./dist/**` bundle for direct download from the Jenkins UI.
   - **Build Hygiene**: Implements timeout protection, log rotation, and build timestamps.

2. **Test Script in [`package.json`](file:///e:/TOC/package.json)**:
   - Configured `"test": "oxlint"` to ensure test-stage compliance.

---

## 🚀 Step-by-Step Connection Guide

### Prerequisites on Jenkins
- A running Jenkins instance (v2.300+ recommended).
- **Plugins installed**:
  - *Git Plugin* (usually part of suggested plugins).
  - *Pipeline Plugin* (usually part of suggested plugins).
  - *(Optional)* *NodeJS Plugin* (if you want Jenkins to automatically manage Node.js versions).

---

### Option 1: Standard Pipeline Job (Quickest)

1. **Create New Item**:
   - In Jenkins Dashboard, click **New Item**.
   - Enter an item name (e.g. `AutomataStudio-Build`).
   - Select **Pipeline** and click **OK**.

2. **Configure General Settings**:
   - Check **GitHub project** and set the URL:
     ```text
     https://github.com/HusainHG/DFA-and-NFA-simulator/
     ```

3. **Configure Build Triggers (Automated Builds on Push)**:
   - Check **GitHub hook trigger for GITScm polling** (or **Poll SCM** / webhook).

4. **Configure Pipeline Definition**:
   - Scroll down to the **Pipeline** section.
   - Change **Definition** to: **Pipeline script from SCM**.
   - Select **SCM**: **Git**.
   - **Repository URL**:
     ```text
     https://github.com/HusainHG/DFA-and-NFA-simulator.git
     ```
   - **Credentials**: Select your GitHub credentials if private, or leave as `- none -` if public.
   - **Branch Specifier**: `*/main` (or `*/master`).
   - **Script Path**: `Jenkinsfile`.
   - Click **Save**.

5. **Run the Build**:
   - Click **Build Now** in the left sidebar.
   - Watch the pipeline stages execute in the **Stage View**:
     - `Checkout` ➔ `Environment Check` ➔ `Install Dependencies` ➔ `Lint & Code Quality` ➔ `Run Tests` ➔ `Build Production Bundle` ➔ `Validate Build Output`.
   - After a successful build, click on the build number to download the archived **`dist`** artifacts!

---

### Option 2: Multibranch Pipeline (Recommended for Teams & PRs)

If you want Jenkins to automatically test every branch and Pull Request:
1. Click **New Item** ➔ Choose **Multibranch Pipeline**.
2. Under **Branch Sources**, add **GitHub** or **Git**.
3. Set the repository URL and credentials.
4. Under **Build Configuration**, set mode to **By Jenkinsfile** with Script Path `Jenkinsfile`.
5. Click **Save**. Jenkins will scan the repository and build branches automatically.

---

## ⚙️ Node.js Configuration in Jenkins

The `Jenkinsfile` expects `node` and `npm` to be accessible on your Jenkins agent. Choose one of the setups below:

### Approach A: Pre-installed Node.js (Default)
If Node.js 18+ or 20+ is already installed on your Jenkins agent machine/server and in the system `PATH`, no changes are needed. The pipeline works out of the box with `agent any`.

### Approach B: Using Jenkins NodeJS Plugin
1. Go to **Manage Jenkins** ➔ **Tools** (or **Global Tool Configuration**).
2. Scroll to **NodeJS installations** ➔ Click **Add NodeJS**.
3. Name it: `NodeJS-20`.
4. Check **Install automatically** and select Node 20.x or higher.
5. In your `Jenkinsfile`, uncomment the `tools` block:
   ```groovy
   tools {
       nodejs 'NodeJS-20'
   }
   ```

### Approach C: Using Docker Agent
If your Jenkins agent has Docker installed, you can replace `agent any` at the top of `Jenkinsfile` with:
```groovy
agent {
    docker {
        image 'node:20-alpine'
        args '-u root'
    }
}
```

---

## 🔗 Automated Push Trigger via GitHub Webhook

To have Jenkins build immediately whenever you push to GitHub:
1. In your GitHub repository, go to **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2. **Payload URL**:
   ```text
   http://<your-jenkins-host>:8080/github-webhook/
   ```
3. **Content type**: `application/json`.
4. **Which events would you like to trigger this webhook?**:
   - Choose **Just the push event** (or select **Let me select individual events** and check *Pushes* and *Pull requests*).
5. Click **Add webhook**.

---

## 📦 Verifying Build Artifacts

Once the build finishes successfully:
- In the Jenkins job page, the build will display **Build Artifacts**.
- Click to view or download the compiled assets from `dist/` (`index.html`, JavaScript bundles, CSS stylesheets, and assets).
