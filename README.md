# Small Shop

Small Shop គឺជាគម្រោងអេឡិចត្រូនិកកាន់តែពេញលេញ មានបណ្ដាញពីមុខ React និង API បន្ទាប់ Laravel។ អ្នកប្រើអាចចុះឈ្មោះ ចូលប្រើបញ្ជាទិញ ហើយមើលប្រវត្តិបញ្ជាទិញ រីឯអ្នកគ្រប់គ្រងអាចគ្រប់គ្រងទំនិញ និងបញ្ជាទិញផ្សេងៗ។

## មុខងារសំខាន់

- ចុះឈ្មោះ និងចូលប្រើជាអ្នកប្រើ
- ទាញទំនិញចេញពី backend រហ័សរាល់ 10 វិនាទី
- បន្ថែម កែបរិមាណ និងដកទំនិញចេញពីរទេះទិញ
- ទិញទំនិញដោយត្រូវមានអត្តសញ្ញាណ និងមូលដ្ឋានផ្ទុកទិន្នន័យ
- មើលប្រវត្តិបញ្ជាទិញរបស់គណនីខ្លួន
- ចូលប្រើផ្នែក Admin ដាច់ដោយឡែក
- បន្ថែម កែសម្រួល និងលុបទំនិញ
- មើលបញ្ជាទិញទាំងអស់សម្រាប់ Admin

## បច្ចេកវិទ្យា

### Frontend

- React 19
- Vite 8
- JavaScript (JSX)
- Nginx សម្រាប់ Docker production
- Oxlint

### Backend

- PHP 8.3
- Laravel 13
- RESTful API
- SQLite ឬ MySQL
- Bearer token authentication
- PHPUnit

## រចនាសម្ព័ន្ធ Project

```text
project/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.jsx           # រៀបចំផ្ទាំង Shop / Admin
│   │   ├── Shop.jsx          # ផ្ទាំងអតិថិជន និងរទេះទិញ
│   │   ├── Admin.jsx         # ផ្ទាំងគ្រប់គ្រង Admin
│   │   ├── api.js            # API និង localStorage helper
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php
│   └── Dockerfile
└── README.md
```

## តម្រូវការប្រព័ន្ធ

- PHP 8.3+
- Composer 2+
- Node.js 20+
- npm
- SQLite ឬ MySQL

## ដំឡើង និងដំណើរការលើម៉ាស៊ីន

### 1. ដំឡើង Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

បើប្រើ SQLite បន្ថែមឯកសារ database អោយមាន ហើយកំណត់ `.env`:

```env
DB_CONNECTION=sqlite
```

បើប្រើ MySQL បង្កើត database រួចកំណត់ចំណុចភ្ជាប់ក្នុង `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

បន្ទាប់មកបង្កើត migration និងទិន្នន័យដំបូង:

```bash
php artisan migrate
php artisan db:seed
php artisan db:seed --class=AdminSeeder
php artisan serve --host=127.0.0.1 --port=8000
```

Backend នឹងដំណើរការនៅ `http://127.0.0.1:8000`។

**គណនី Admin ទិន្នន័យនាំចូល:**

- Username: `kongbarang`
- Password: `barang123`

> គណនីនេះសម្រាប់ development/demo។ ប្តូរ password នៅមុន deployment។

### 2. ដំឡើង Frontend

បើក Terminal ថ្មីពី root:

```bash
cd frontend
npm install
npm run dev
```

Frontend លំនាំដើរនឹងបង្ហាញ URL របស់ Vite ជាធម្មតា `http://localhost:5173`។

Frontend ភ្ជាប់ទៅ Backend តាម `http://localhost:8000/api` ដែលកំណត់ក្នុង `frontend/src/api.js`។

## ផ្លូវរបស់ Frontend

| ផ្លូវ | ការប្រើប្រាស់ |
|---|---|
| `/` | ទំព័ររទេះទិញ និងផ្ទាំងអតិថិជន |
| `/adminsmallshop` | ចូលប្រើ និងគ្រប់គ្រងផ្នែក Admin |

## API Routes

Base URL: `http://localhost:8000/api`

| Method | Route | Auth | ការពិពណ៌នា |
|---|---|---|---|
| `GET` | `/products` | - | ទាញបញ្ជីទំនិញ |
| `POST` | `/register` | - | បង្កើតគណនីអតិថិជន |
| `POST` | `/login` | - | ចូលប្រើអតិថិជន |
| `POST` | `/admin/login` | - | ចូលប្រើគណនី Admin |
| `POST` | `/logout` | Bearer token | ចាកចេញ |
| `POST` | `/checkout` | Bearer token | បង្កើតបញ្ជាទិញ |
| `GET` | `/my-orders` | Bearer token | មើលបញ្ជាទិញរបស់ខ្លួន |
| `GET` | `/admin/orders` | Admin token | មើលបញ្ជាទិញទាំងអស់ |
| `POST` | `/admin/products` | Admin token | បន្ថែមទំនិញ |
| `PUT` | `/admin/products/{id}` | Admin token | កែទំនិញ |
| `DELETE` | `/admin/products/{id}` | Admin token | លុបទំនិញ |

API ដែលត្រូវ authentication ប្រើ header:

```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
Content-Type: application/json
```

## ដំណើរការដោយ Docker

មិនមាន Docker Compose បង្កើតជាស្រេចទេ។ អាច build និង run Frontend និង Backend ដោយឯករាជ្យបាន។

### Backend

```bash
cd backend
docker build -t small-shop-backend .
docker run --rm -p 8000:8000 --env-file .env small-shop-backend
```

Container នឹង run migration ដោយស្វ័យប្រវត្តិ មុន php artisan server.

### Frontend

```bash
cd frontend
docker build -t small-shop-frontend .
docker run --rm -p 5173:80 small-shop-frontend
```

បន្ទាប់មកបើក `http://localhost:5173`។

## Testing និង Quality Check

Backend:

```bash
cd backend
php artisan test
```

Frontend build:

```bash
cd frontend
npm run build
npm run lint
```

## កំណត់ចំណាំអំពីការកំណត់រចនាសម្ព័ន្ធ

- Frontend កំណត់ API URL ក្នុង `frontend/src/api.js`។
- Shop auth និង Admin auth ត្រូវបានរក្សាទុកក្នុង browser `localStorage`។
- Backend ប្រើ SHA-256 hash ដើម្បីរក្សា API token ក្នុង database។
- Migration សំខាន់ៗគឺ User, Product, Order និង OrderItem។
- បញ្ជាទិញមិនអាចលុបបានទេពេលទំនិញត្រូវបានប្រើក្នុងក្បាលបញ្ជាទិញ។
- មុន deployment ត្រូវកំណត់ database credentials និង admin password សុវត្ថិភាព។

## Troubleshooting

**Cannot connect to Backend:**

- ពិនិត្យថា `php artisan serve` កំពុងដំណើរការ។
- ពិនិត្យថា API URL ក្នុង `frontend/src/api.js` ត្រូវនឹង backend URL។
- បើ frontend និង backend មាន origin មិនដូចគ្នា ត្រូវ configure CORS ក្នុង Laravel។

**Database connection errors:**

- ពិនិត្យ `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` និង `DB_PASSWORD` ក្នុង `.env`។
- សម្រាប់ SQLite ត្រូវប្រាកដថា database file មាននៅ `backend/database/database.sqlite`។

**Migration errors:**

```bash
cd backend
php artisan migrate:fresh
php artisan db:seed
php artisan db:seed --class=AdminSeeder
```