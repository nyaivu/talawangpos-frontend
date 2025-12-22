# TalawangPOS
TalawangPOS is a point of sale web app that is built to handle multiple businesses such as cafes and restaurants at the same time.

## Features
### 1. Multi-tenancy
  Each business gets their own subdomain to use as the home of their dashboards. Creating the feel of a custom made website filled with only their own products for ease of use.
### 2. Fast order creation
   Orders are stored locally first when picking the products and only sent after it is finalized which means only a few query is sent per order at the end.
### 3. Flexibility
   Built to suit the needs of most businesses, products and categories can be anything and in any language.
### 4. Midtrans Implementation (WIP)
  Built-in Midtrans integration by storing each business' midtrans merchant ID and creating a payment request in the orders page. Can be done right after customer has ordered or when they are about to leave. 
