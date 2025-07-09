
# College Store Management System

This system facilitates a hierarchical process for managing product requests within a college environment. Staff members submit requests for required products to their respective department stores. Each department in the college has its own store manager responsible for overseeing these requests.

Additionally, department stores have the capability to further request products from the main college store. However, before proceeding, these requests must first be approved by the Head of Department (HOD) associated with the requesting department. Once approved by the HOD, the request is automatically escalated to the College Principal for final approval.

The main college store is responsible for managing the overall inventory and stock levels. Upon receiving requests from department stores, the main store verifies product availability and approves requests accordingly. Upon approval, the system automatically updates the database to reflect changes in stock levels and request statuses.

After approving requests, the main store personnel are required to fill out a form containing stock details such as bill number, inward number, and deadstock number. These details are associated with all approved requests, ensuring a unified record-keeping system. Each set of approved requests is assigned a single bill number, inward number, etc., streamlining the administrative process.

For department stores, the process is simplified to approving requests based on available stock levels. The system automatically updates inventory and request statuses based on these approvals.


## Deployment

To run the server:

```bash
  npm run dev
```

## Initial Setup Instructions

1. **Remove Authorization Function**: For the initial setup, remove the authorization function from both the GET and POST `/addLogin` API endpoints.

2. **Create Admin Login**: Create a login with the role of admin. This login grants access to the main store section. 

3. **Access Main Store Section**: After logging in with the admin email, you'll have access to the main store section. From here, you can create new login credentials for departments and staff members.

4. **Create Logins for Departments and Staff**: On the sidebar of the products section, there is a button named "Products" on the right-hand side of the homepage. Use this button to access the products section. From here, you can create logins for departments and staff members.

5. **Adding Products**: In the products section, products are divided into two categories: non-consumable products and consumable products (ledgers). Make sure to add products depending on their type.

6. **Requesting Products**: Departments and staff/lab members can only request products that are available in the products section. They can request products by filling out a form.

7. **Reinstate Authorization Function**: After creating the admin login and completing the initial setup, reinstate the authorization function to enhance website security.

## Product Page

For the Product page, React is used, which is converted into a JavaScript file using Babel. After making changes in the React part of the page, run the command `npm run build`. This will create `bundle.js` in the `dist` folder which is to be created by you before running the command. Then, move that `bundle.js` into the `javascript` folder inside the `public` folder. The changes made will be visible after this process.
