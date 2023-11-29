# Gym Management Server - API

> http://localhost:3000/api/{ROUTE}/{ENDPOINT}

-   Request methods: `GET`, `POST`, `PUT`.
-   Expect `auth` in `ROUTE`, all requests will need `Authorization` in headers.
-   Request methods with `POST` and `PUT` will need payload, if there's no data for payload, leave it to `{}` (Make sure do not let it empty).

---

-   Default Content-Type for all response: `application/json`.
-   Default Object API for all response:

```ts
{
    "message": string,
    "code": number, // HTTP Code.
    "success": boolean,
    "data": { [key: string]: any }
}
```

-   Default max of `limit` in search params for all request: `100`.

---

---

## Role 0: User

### ROUTE: `/auth`

<details>
    <summary><code>POST</code> <code><b>/register</b></code> <code>Do create new user</code></summary>

##### Parameters

> | Name        | Type     | Data type | Default | Description        |
> | ----------- | -------- | --------- | ------- | ------------------ |
> | email       | required | string    |         |                    |
> | password    | required | string    |         | min length is 6    |
> | fullName    | required | string    |         |                    |
> | gender      | required | number    |         | range from -1 to 1 |
> | address     | required | string    |         |                    |
> | phoneNumber | required | string    |         |                    |

##### Responses in data.

> | name  | Data type | Description                   |
> | ----- | --------- | ----------------------------- |
> | token | string    | JWT Token, valid for 24 hours |

</details>

<details>
    <summary><code>POST</code> <code><b>/login</b></code> <code>Do user login</code></summary>

##### Parameters

> | Name     | Type     | Data type | Default | Description     |
> | -------- | -------- | --------- | ------- | --------------- |
> | email    | required | string    |         |                 |
> | password | required | string    |         | min length is 6 |

##### Responses in data.

> | name  | Data type | Description                   |
> | ----- | --------- | ----------------------------- |
> | token | string    | JWT Token, valid for 24 hours |

</details>

<br />

### ROUTE: `/user`

<details>
    <summary><code>GET</code> <code><b>/</b></code> <code>Get user data</code></summary>

##### Parameters

> | Name | Type | Data type | Default | Description |
> | ---- | ---- | --------- | ------- | ----------- |

##### Responses in data.

> | name        | Data type | Description |
> | ----------- | --------- | ----------- |
> | fullName    | string    |             |
> | gender      | number    |             |
> | address     | string    |             |
> | phoneNumber | string    |             |
> | photo       | string    |             |
> | role        | number    |             |

</details>

<details>
    <summary><code>PUT</code> <code><b>/</b></code> <code>Update user data</code></summary>

##### Parameters

> | Name        | Type     | Data type | Default | Description        |
> | ----------- | -------- | --------- | ------- | ------------------ |
> | password    | optional | string    |         |                    |
> | fullName    | optional | string    |         |                    |
> | gender      | optional | number    |         | range from -1 to 1 |
> | address     | optional | string    |         |                    |
> | phoneNumber | optional | string    |         |                    |
> | photo       | optional | string    |         |                    |

##### Responses in data.

> | name                                  | Data type                             | Description |
> | ------------------------------------- | ------------------------------------- | ----------- |
> | ...(Follow data name from Parameters) | ...(Follow data type from Parameters) |             |

</details>

<br />

### ROUTE: `/attendance`

<details>
    <summary><code>GET</code> <code><b>/</b></code> <code>Get list of check in</code></summary>

##### Parameters

> | Name   | Type     | Data type | Default | Description                                 |
> | ------ | -------- | --------- | ------- | ------------------------------------------- |
> | limit  | optional | number    | 20      |                                             |
> | page   | optional | number    | 1       |                                             |
> | format | optional | boolean   | false   | format ISO date to `dd/mm/yyyy hh:MM:ss tt` |

##### Responses in data.

> | name            | Data type | Description   |
> | --------------- | --------- | ------------- |
> | list            | Array     |               |
> | list[X].timeIn  | string    | Array in list |
> | list[X].timeOut | string    | Array in list |
> | currentPage     | number    |               |
> | totalPage       | number    |               |

</details>

<details>
    <summary><code>POST</code> <code><b>/checkin</b></code> <code>Do check in</code></summary>

##### Parameters

> | Name | Type | Data type | Default | Description |
> | ---- | ---- | --------- | ------- | ----------- |

##### Responses in data.

> | name | Data type | Description |
> | ---- | --------- | ----------- |

</details>

<details>
    <summary><code>POST</code> <code><b>/checkout</b></code> <code>Do check out</code></summary>

##### Parameters

> | Name | Type | Data type | Default | Description |
> | ---- | ---- | --------- | ------- | ----------- |

##### Responses in data.

> | name | Data type | Description |
> | ---- | --------- | ----------- |

</details>

<br />

### ROUTE: `/plan`

<details>
    <summary><code>GET</code> <code><b>/</b></code> <code>Get list of plan</code></summary>

##### Parameters

> | Name  | Type     | Data type | Default | Description                            |
> | ----- | -------- | --------- | ------- | -------------------------------------- |
> | limit | optional | number    | 20      |                                        |
> | page  | optional | number    | 1       |                                        |
> | long  | optional | boolean   | false   | format timestamp to readable date time |

##### Responses in data.

> | name             | Data type        | Description   |
> | ---------------- | ---------------- | ------------- |
> | list             | Array            |               |
> | list[X].planId   | number           | Array in list |
> | list[X].title    | string           | Array in list |
> | list[X].details  | string           | Array in list |
> | list[X].price    | number           | Array in list |
> | list[X].duration | number or string | Array in list |
> | currentPage      | number           |               |
> | totalPage        | number           |               |

</details>

<details>
    <summary><code>GET</code> <code><b>/{planId}</b></code> <code>Get plan data from plan follow planId</code></summary>

##### Parameters

> | Name | Type     | Data type | Default | Description                            |
> | ---- | -------- | --------- | ------- | -------------------------------------- |
> | long | optional | boolean   | false   | format timestamp to readable date time |

##### Responses in data.

> | name     | Data type        | Description |
> | -------- | ---------------- | ----------- |
> | title    | string           |             |
> | details  | string           |             |
> | price    | number           |             |
> | duration | number or string |             |

</details>

## Role 1: Trainer

_Currently empty._

## Role 2: Admin

### ROUTE: `/user`

<details>
    <summary><code>GET</code> <code><b>/{userId}</b></code> <code>Get user data from an user data follow userId</code></summary>

##### Parameters

> | Name | Type | Data type | Default | Description |
> | ---- | ---- | --------- | ------- | ----------- |

##### Responses in data.

> | name        | Data type | Description |
> | ----------- | --------- | ----------- |
> | email       | string    |             |
> | fullName    | string    |             |
> | gender      | number    |             |
> | address     | string    |             |
> | phoneNumber | string    |             |
> | photo       | string    |             |
> | role        | number    |             |

</details>

<details>
    <summary><code>PUT</code> <code><b>/{userId}</b></code> <code>Update user data for an user follow userId</code></summary>

##### Parameters

> | Name        | Type     | Data type | Default | Description        |
> | ----------- | -------- | --------- | ------- | ------------------ |
> | email       | optional | string    |         |                    |
> | password    | optional | string    |         |                    |
> | role        | optional | number    |         |                    |
> | fullName    | optional | string    |         |                    |
> | gender      | optional | number    |         | range from -1 to 1 |
> | address     | optional | string    |         |                    |
> | phoneNumber | optional | string    |         |                    |
> | photo       | optional | string    |         |                    |

##### Responses in data.

> | name                                  | Data type                             | Description |
> | ------------------------------------- | ------------------------------------- | ----------- |
> | ...(Follow data name from Parameters) | ...(Follow data type from Parameters) |             |

</details>

<details>
    <summary><code>GET</code> <code><b>/{userId}/attendance</b></code> <code>Get check in list from an user follow userId</code></summary>

##### Parameters

> | Name   | Type     | Data type | Default | Description                                 |
> | ------ | -------- | --------- | ------- | ------------------------------------------- |
> | limit  | optional | number    | 20      | max: 100                                    |
> | page   | optional | number    | 1       |                                             |
> | format | optional | boolean   | false   | format ISO date to `dd/mm/yyyy hh:MM:ss tt` |

##### Responses in data.

> | name            | Data type | Description   |
> | --------------- | --------- | ------------- |
> | list            | Array     |               |
> | list[X].timeIn  | string    | Array in list |
> | list[X].timeOut | string    | Array in list |
> | currentPage     | number    |               |
> | totalPage       | number    |               |

</details>

<br/>

### ROUTE: `/plan`

<details>
    <summary><code>POST</code> <code><b>/</b></code> <code>Do create new plan</code></summary>

##### Parameters

> | Name     | Type     | Data type | Default | Description        |
> | -------- | -------- | --------- | ------- | ------------------ |
> | title    | required | string    |         |                    |
> | details  | required | string    |         |                    |
> | price    | required | number    |         |                    |
> | duration | required | number    |         | also accept string |

##### Responses in data.

> | name   | Data type | Description |
> | ------ | --------- | ----------- |
> | planId | number    |             |

</details>

<details>
    <summary><code>PUT</code> <code><b>/{planId}</b></code> <code>Update plan data for a plan follow planId</code></summary>

##### Parameters

> | Name     | Type     | Data type | Default | Description        |
> | -------- | -------- | --------- | ------- | ------------------ |
> | title    | optional | string    |         |                    |
> | details  | optional | string    |         |                    |
> | price    | optional | number    |         |                    |
> | duration | optional | number    |         | also accept string |

##### Responses in data.

> | name                                  | Data type                             | Description |
> | ------------------------------------- | ------------------------------------- | ----------- |
> | ...(Follow data name from Parameters) | ...(Follow data type from Parameters) |             |

</details>

<br/>

---

---

# Thank you for making [REST API docs in Markdown](https://gist.github.com/azagniotov/a4b16faf0febd12efbc6c3d7370383a6), [azagniotov](https://github.com/azagniotov)!

<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
