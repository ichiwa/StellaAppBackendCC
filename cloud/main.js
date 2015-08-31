"use strict";

// Web routing
require('cloud/web/app.js');

// Web Hooks
require('cloud/hooks/after_saved_user_housework.js');

// API routing
require('cloud/api/hello.js');
require('cloud/api/add_user.js');
require('cloud/api/connect_partner.js');
require('cloud/api/disconnect_partner.js');
require('cloud/api/save_user_housework_of_a_day.js');
require('cloud/api/sync_partner_housework.js');