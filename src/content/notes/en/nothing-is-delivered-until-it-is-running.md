---
title: Nothing is delivered until it is running
description: The handover is where many web projects quietly fail. A zip file is not a deliverable. A URL that stays up is. Here is what a real handover includes.
date: 2026-09-03
category: Delivery
translationKey: delivered-running
image: editorial/note-running-article-en.webp
listImage: editorial/note-running-list-en.webp
cardImage: editorial/note-running-card-en.webp
thumb: editorial/note-running-thumb-en.webp
---

The build ends, a final invoice goes out, and the vendor sends a repository link or a zip file. From their side, the job is done. From yours, it has just started: someone now has to put that software on a server, point a domain at it, secure it, and keep it running.

Often, nobody has.

## How projects fail after the build

It rarely happens on launch day. It happens weeks later. A certificate expires and browsers warn visitors away. A server fills up and the site stops responding. An update breaks a form, and leads stop arriving without anyone noticing. By then the original developer has moved on, and the knowledge of how everything fits together left with them.

The build was the easy part. Running it is the part that was never included.

## What should exist on day one

A project isn't finished until these are in place and working:

- **Deployment** — the site or system runs on configured infrastructure, with a repeatable way to release changes.
- **Domain and SSL** — the real address works, securely, and renewals are handled.
- **Monitoring** — someone is alerted when it goes down, before your customers notice.
- **Backups** — data can be restored, and the restore has actually been tested.
- **Documentation** — how it's built, where it runs, and how to operate it.
- **A walkthrough** — the people taking responsibility have seen it working.

## Ownership and access

Delivered running doesn't mean dependent. You should hold the repository, the infrastructure accounts, and the documentation — whether or not the studio keeps looking after it. If you decide to move on, you take everything and go. A working relationship is worth keeping when leaving is easy.

## Questions to ask before you sign

- Is deployment included, or is it a separate project?
- Who configures the domain, SSL, monitoring, and backups?
- What documentation will we receive?
- If we stop working together, what do we keep, and how do we get it?

A repository is not a deliverable. A URL that stays up is.
