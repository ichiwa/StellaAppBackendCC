"use strict";

// Web Hooks
require('./hooks/after_scheduled_task_saving.js');
require('./hooks/after_user_wish_item_saving.js');
require('./hooks/after_task_saving.js');

// API routing
require('./api/hello.js');
require('./api/add_user.js');

// partner ship
require('./api/connect_partner.js');
require('./api/disconnect_partner.js');

// scheduled task
require('./api/save_scheduled_task_of_a_day.js');
require('./api/sync_scheduled_task.js');

// user info 
require('./api/update_user_info.js');

// wish items
require('./api/update_user_wish_item.js');
require('./api/delete_user_wish_item.js');
require('./api/add_user_wish_item.js');
require('./api/sync_partner_wish_item.js');

// task
require('./api/update_task.js');