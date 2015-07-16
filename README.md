# Installation

To do

# Configuration

1. Log into your Mailchimp Account
2. Click on "Lists" from the sidebar
3. Click on the list for which you want
4. Click "Signup forms"
5. Select "Embedded forms"
6. Select "Naked"

You must obtain the following information from the form action attribute code:

* `mailchimp.username` - Your MailChimp username, immediately follows `http://`
* `mailchimp.dc` - Your MailChimp distribution center, immediately follows your username
* `mailchimp.u` - Unique string that identifies your account. It is obtained from 
* `mailchimp.id` - A unique string that identifies your list.

Example::

    <form action="http://username.us1.list-manage.com/subscribe/post?u=a1b2c3d4e5f6g7h8i9j0&amp;id=aabb12" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>

Result:

* `mailchimp.username` - `username`
* `mailchimp.dc` - `us1`
* `mailchimp.u` - `a1b2c3d4e5f6g7h8i9j0`
* `mailchimp.id` - `aabb12`

# Usage

To Do

# License

The MIT License

Copyright (c) 2015 Eder Sanchez, based on a work by Keith Hall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
