"use strict";

// Web routing
require('cloud/web/app.js');

// Web Hooks
require('cloud/hooks/after_scheduled_task_saving.js');
require('cloud/hooks/after_user_wish_item_saving.js');
require('cloud/hooks/after_task_saving.js');

// API routing
require('cloud/api/hello.js');
require('cloud/api/add_user.js');

// partner ship
require('cloud/api/connect_partner.js');
require('cloud/api/disconnect_partner.js');

// scheduled task
require('cloud/api/save_scheduled_task_of_a_day.js');
require('cloud/api/sync_scheduled_task.js');

// user info 
require('cloud/api/update_user_info.js');

// wish items
require('cloud/api/update_user_wish_item.js');
require('cloud/api/delete_user_wish_item.js');
require('cloud/api/add_user_wish_item.js');
require('cloud/api/sync_partner_wish_item.js');

// task
require('cloud/api/update_task.js');