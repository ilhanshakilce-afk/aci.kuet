# acikuet.org - ACI Student Chapter (KUET)

Official website and technical portal for the **American Concrete Institute (ACI) Student Chapter at Khulna University of Engineering & Technology (KUET)**.

![ACI KUET Status](https://img.shields.io/badge/status-active-success)
![Platform](https://img.shields.io/badge/platform-HTML5%20%7C%20CSS3%20%7C%20C%2B%2B%20%7C%20Java-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Key Features

1. **Brand & Identity:** Styled around the American Concrete Institute (ACI) international standard theme, customized for KUET Department of Civil Engineering.
2. **Flagship Competitions:**
   - **Concase 2026** (Forensic concrete failure analysis).
   - **Pervious Concrete Challenge** (Permeable eco-friendly mix).
   - **Intra-KUET Concrete Olympiad** (Knowledge & quiz duel).
3. **Interactive ACI 211.1 Mix Design Engine:**
   - Real-time computation of water-cement ratio ($w/c$), net water, cement, fine aggregate (sand), and coarse aggregate (stone chips) using the ACI absolute volume method.
   - Interactive visual fraction bar.
4. **Executive Committee 2025–2026:** Faculty Advisor, President, Vice President, General Secretary, and team profiles.
5. **Notice Board & Downloads:** Live category filters (Competitions, Workshops, Academic).
6. **Online Registration & Membership:** Full validation, local storage persistence, and REST API logging.
7. **Dark / Light Mode:** Persistent theme toggle.

---

## 🚀 How to Run the Website

### Method 1: Run with High-Speed C++ Server (Pre-compiled)
A high-performance C++17 HTTP web server is included in the root directory:
```bash
./acikuet_server
```
Then open your browser at: **`http://localhost:8080`**

*(To recompile anytime):*
```bash
clang++ -std=c++17 -O2 -pthread server.cpp -o acikuet_server
./acikuet_server
```

---

### Method 2: Run with Python 3
```bash
python3 server.py
```
Visit: **`http://localhost:8080`**

---

### Method 3: Direct Browser Launch (Static)
Simply double click or open **`index.html`** in any web browser (Chrome, Safari, Firefox, Edge).

---

### Method 4: Java Enterprise Microservice
Once JDK 17/21 is installed:
```bash
javac -d bin java/AcikuetApplication.java
java -cp bin org.acikuet.AcikuetApplication
```
Runs at: **`http://localhost:8081`**

---

## 📦 Connecting and Pushing to GitHub

To push this codebase to your own GitHub account:

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `acikuet.org` (or `acikuet-web`)
   - Keep it **Public** or **Private**, and **do not** check "Initialize with README".

2. **Run these commands in your terminal:**
   ```bash
   git init
   git add .
   git commit -m "Initial release of acikuet.org website"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

3. **Enable Free GitHub Pages Hosting (1-click):**
   - Go to your repository **Settings** > **Pages**.
   - Under **Build and deployment** > Source: Select **Deploy from a branch**.
   - Branch: Select `main` / `/ (root)` and click **Save**.
   - Your site will be live instantly across the world!

---

## 📂 Project Architecture

```
KBECWEB/
├── index.html               # Main landing portal & pages
├── css/
│   └── styles.css           # Responsive, dark/light themes, animations
├── js/
│   ├── app.js               # Theme, navigation, modal, form validation
│   └── mix-calculator.js    # ACI 211.1 Concrete mix calculation engine
├── server.cpp               # Native C++17 HTTP & REST API server
├── server.py                # Python 3 fallback server
├── java/
│   └── AcikuetApplication.java # Java backend reference
├── .gitignore               # Git exclude rules
└── README.md                # Project documentation
```

&copy; 2026 **ACI Student Chapter - KUET** (acikuet.org).
