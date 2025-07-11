# Report_Telegram

Telegram-integrated reporting system for project and ticket tracking.

## Overview

**Report_Telegram** is a solution for managing project and ticket reporting, with integration to Telegram for user interaction and notifications. The backend leverages Oracle PL/SQL for data handling and JavaScript for application logic.

---

## Features

- Project and ticket list management
- Ticket filtering by site and ticket ID
- Telegram user registration and authentication
- PDF report generation for tickets
- Modular SQL package for database logic

---

## Project Structure
Report_Telegram/
│
├── sql/
│   └── PKG_GO_REPORT.sql        # Oracle PL/SQL package for database logic
│
├── src/
│   └── ...                      # JavaScript source files (Telegram bot, API, etc.)
│
├── README.md
└── ...
---

## SQL Package: PKG_GO_REPORT

Located at [`sql/PKG_GO_REPORT.sql`](sql/PKG_GO_REPORT.sql), this Oracle package contains all the core database logic for the project.

### Main Functions

- `FN_LIST_PROJECT_GO`: Lists all projects from `VW_PROYECTOS_GOREPORT`.
- `FN_LIST_TICK_PROJECT_GO(VSITE)`: Lists tickets from `WV_REPORT_TIC_PREV_TELEG` filtered by site.
- `FN_LIST_TICK_PROJECT_ABAS_GO(VSITE)`: Lists tickets from `WV_REPORT_TIC_ABAS_TELEG` by site.
- `FN_LIST_TICK_PROJECT_ABAS_GPDF(VTICKET)`: Gets ticket details for PDF (ABAS).
- `FN_LIST_TICK_PROJECT_MGP_GO(VSITE)`: Lists tickets from `WV_REPORT_TIC_MGP_TELEG` by site.
- `FN_LIST_TICK_PROJECT_MGP_GOPDF(VTICKET)`: Gets ticket details for PDF (MGP).
- `FN_LIST_TICK_PROJECT_CORR_GO(VSITE)`: Lists tickets from `WV_REPORT_TIC_CORR_TELEG` by site.
- `FN_LIST_TICK_PROJECT_CORR_GPDF(VTICKET)`: Gets ticket details for PDF (CORR).
- `FN_USER_EXISTS(P_USER_ID)`: Checks if a Telegram user exists and gets their authorization.

### Main Procedure

- `PROC_INSERT_USER_TELEGRAM(VUSER_ID, VCELLPHONE, VFIRSTNAME)`: Adds a Telegram user to the database.

---

## Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/davgar2023/Report_Telegram.git
    ```

2. **Database Setup:**
   - Run `sql/PKG_GO_REPORT.sql` in your Oracle database.
   - Ensure all referenced tables and views (`TBL_USER_TELEGRAM`, `VW_PROYECTOS_GOREPORT`, etc.) are present.

3. **Application Setup:**
   - Follow instructions in the `src/` folder for configuring JavaScript and the Telegram bot.

---

## Usage

- Use the Telegram bot to interact with the reporting system.
- The backend uses `PKG_GO_REPORT` functions and procedures for database operations.

---

## Contributing

Contributions and issues are welcome! Please open an issue or pull request to discuss your ideas or report bugs.

---

## License

MIT License
