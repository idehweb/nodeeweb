---
sidebar_position: 6
---


# System Notifications

## Table of Contents

- [Introduction to System Notifications](#introduction-to-system-notifications)
- [System Notification Abstraction Class](#systemnotif-abstractions-class)
- [Default Classes](#default-system-notifs)
- [API](#api)
- [Customize and Usage](#customize-and-usage)

## Introduction to System Notifications

nodeeweb use global event emitter for every single actions, so we can notif some of then into Admin Panel, we called that notifications **System Notifications**


## SystemNotif abstractions class
```ts
abstract class SystemNotif {
  abstract id: string;
  abstract type: string;
  abstract register(store: any): void | Promise<void>;
  abstract unregister(store: any): void | Promise<void>;
}
```

## Default System Notifs
each `CoreSystemNotif` provide save method which write into `systemNotif` collection

- **LogNotif** observe every logs
- **UserRegisterNotif** observe every user registration

## API
we can use crud api on base url `/systemNotif/notif` to **Get All**, **Get Count**, **Get One** and **Update One**

## Customize and Usage
1) create a class that implement [SystemNotif](#systemnotif-abstractions-class) class
2) register new SystemNotif class into `store`
```ts
await registerSystemNotif(myCustomSysNotif);  
```