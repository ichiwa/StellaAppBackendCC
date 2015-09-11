"use strict";

// Web routing
require('cloud/web/app.js');

// Web Hooks
require('cloud/hooks/after_user_housework_saving.js');
require('cloud/hooks/after_user_wish_item_saving.js');

// API routing
require('cloud/api/hello.js');
require('cloud/api/add_user.js');
require('cloud/api/connect_partner.js');
require('cloud/api/disconnect_partner.js');
require('cloud/api/save_user_housework_of_a_day.js');
require('cloud/api/sync_partner_housework.js');
require('cloud/api/update_user_info.js');
require('cloud/api/update_user_wish_item.js');
require('cloud/api/delete_user_wish_item.js');
require('cloud/api/add_user_wish_item.js');
require('cloud/api/sync_partner_wish_item.js');