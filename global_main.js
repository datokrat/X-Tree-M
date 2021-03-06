var extra_keys = c_KEYB_MODE_NONE;
var my_path = "";
var log_var = [];



// #######################################################################################
// ### Key Processing                                                                  ###
// #######################################################################################


// optional Feature (later on) : Key-Logging
function global_main_log_keys(extra_keys, my_key, dispatched)
{
  var log_item = {};
  log_item.ekeys = extra_keys;
  log_item.my_key = my_key;
  log_item.dispatched = dispatched;
  log_var[log_var.length] = log_item;
}  

// process following keys : Shift, Alt Ctrl
function global_main_process_extra_keys(e)
{
  extra_keys = c_KEYB_MODE_NONE;

  if (e.shiftKey)
    extra_keys = c_KEYB_MODE_SHIFT_ONLY;
  if (e.ctrlKey)
    extra_keys = extra_keys + c_KEYB_MODE_CTRL_ONLY;
  if (e.altKey)
    extra_keys = extra_keys + c_KEYB_MODE_ALT_ONLY;
//  global_main_log_keys(extra_keys, e.keyCode, false);
}


function global_main_key_event(e)
{
  var my_key = e.keyCode;
                                      // suppress default scrolling of cursor keys
  if([37, 38, 39, 40].indexOf(my_key) > -1) {
        e.preventDefault();
  }


  var dispatched = false;
  if (my_key != undefined)
  {
    if ((my_key != 16) && (my_key != 17) && (my_key != 18) && (my_key < 115))
    {                 
      global_main_process_extra_keys(e);
      this.curr_uc_main.keyb_proc(my_key, extra_keys, e);
      dispatched = true;
    }
  }
  // global_main_log_keys(extra_keys, my_key, dispatched);

}


// #######################################################################################
// ### Other Events                                                                    ###
// #######################################################################################

// catch mouse clicks and process forwarded keyboard inputs
function global_main_event(receiver, sender, submodule, item, mode, event)
{
  // choose element type
  if (receiver == "global_disp")
  {
    // ... 
  }
  else
  {
    if (event != undefined)
      global_main_process_extra_keys(event);
    while (this.curr_uc_main == undefined) {}
    this.curr_uc_main.clicked_at(sender, submodule, item, extra_keys);
  }
}


// ##########################################################################
// ### Events from the Main Window (resize, mouseover, etc.)              ###
// ##########################################################################

var currently_selected_panel = 0; // === window.currently_selected_panel
var formerly_selected_panel = 0;  // === window.formerly_selected_panel
var panel_names = new Array("div_panel1", "div_panel2", "div_panel3", "div_panel4");
var curr_uc_main; // current use case

// update the sizes of the window, its panels and so on
function global_main_win_resize()
{
//  alert("resize1");
                                    // get total window size
  var win_width = get_total_win_width(window);
  var win_height = get_total_win_height(window);
                                    // calculate and process height settings for HTML
  var middle_area_height = Math.round((win_height - 92)*0.8);
  var low_area_height = Math.round((win_height - 92)*0.2);
  var middle_area_height_str = new String(middle_area_height) + "px";
  var low_area_height_str = new String(low_area_height) + "px";
  var middle_area_height_child_str = new String(middle_area_height - 20) + "px";
//  alert("resize2");
                                    // propagate new height settings to HTML
  var elem;
  elem = document.getElementById("div_middle_area"); elem.style.height = middle_area_height_str;
  elem = document.getElementById("div_panel1"); elem.style.height = middle_area_height;
  elem = document.getElementById("div_panel1_content"); elem.style.height = middle_area_height_child_str;
  elem = document.getElementById("div_panel2"); elem.style.height = middle_area_height;
  elem = document.getElementById("div_panel2_content"); elem.style.height = middle_area_height_child_str;
  elem = document.getElementById("div_panel3"); elem.style.height = middle_area_height;
  elem = document.getElementById("div_panel3_content"); elem.style.height = middle_area_height_child_str;
  elem = document.getElementById("div_panel4"); elem.style.height = low_area_height_str;
  elem = document.getElementById("div_panel4_content"); elem.style.height = low_area_height_str;
//  alert("resize4");
                                    // calculate, prepare and propagate new panel widths
  var maximized_panel_width_str = new String(Math.round((win_width - 32)*0.8)) + "px";
  var minimized_panel_width_str = new String(Math.round((win_width - 32)*0.1)) + "px";
  for (var i=0; i<3; i++)
  {
    elem1 = document.getElementById(panel_names[i]);
    elem2 = document.getElementById(panel_names[i]+"_content");
    if (i==window.currently_selected_panel)
      {elem1.style.width = maximized_panel_width_str; elem2.style.width = maximized_panel_width_str;}
    else
      {elem1.style.width = minimized_panel_width_str; elem2.style.width = minimized_panel_width_str;}
  }
//  alert("resize5");

//  elem = document.getElementById("div_panel4"); elem.style.height = low_area_height_str;
//  elem = document.getElementById("div_panel4_content"); elem.style.height = low_area_height_str;
//  alert("resize6");
}


/*
 * Changes the selected panel to selected_panel but only if selected_panel is also the currently selected panel.
 */
function global_main_change_panel_focus_aux(selected_panel)
{
  var elem;
                                    // get total window size
  var win_width = get_total_win_width(window);
  var win_height = get_total_win_height(window);
                                    // still same mouseover used ?
  if (currently_selected_panel==selected_panel)
  {
//    alert("cresize1");
    elem = document.getElementById(panel_names[formerly_selected_panel]);
    elem.style.width = new String(Math.round((win_width-32) * 0.1)) + "px";
    elem = document.getElementById(panel_names[formerly_selected_panel]+"_content");
    elem.style.width = new String(Math.round((win_width-32) * 0.1)) + "px";
//    alert("cresize2");
    elem = document.getElementById(panel_names[selected_panel]);
    elem.style.width = new String(Math.round((win_width-32) * 0.8)) + "px";
    elem = document.getElementById(panel_names[selected_panel]+"_content");
    elem.style.width = new String(Math.round((win_width-32) * 0.8)) + "px";
    formerly_selected_panel = selected_panel;
  }
}

/*
 * Changes the visible selected panel with a delay. If the currently selected panel is still the given one after a delay, then the visible selected panel is updated.
 */
function global_main_change_panel_focus(selected_panel)
{
  setTimeout(function() {global_main_change_panel_focus_aux(selected_panel);},500); 
  currently_selected_panel = selected_panel;
}


// ##########################################################################
// ### Functions to handle Globle Setup                                   ###
// ##########################################################################


// Save information in cookie (if configured)
function global_main_save_setup()
{
  if (global_status.global_setup_loaded == true)
  {
    switch (global_status.actual_setup_src_type)
    {
      case c_DATA_SOURCE_TYPE_ID_COOKIE :
            var setup_cookie = new lib_data_cookie(plugin_name, my_path, global_status.actual_setup_src_path);
            setup_cookie.write("data", global_setup);
          break;
      default :
          break;
    }
  }
}


function global_main_load_setup()
{
  // ### part 1 - try to find the path to the Global Setup


                                    // create Setup Source Cookie Object and read it
  var setup_src_cookie = new lib_data_cookie(plugin_name, my_path, c_DEFAULT_SETUP_SOURCE_COOKIE_NAME);
  var setup_src_data = setup_src_cookie.read("data");
  var setup_src_type = null;
  var setup_src_path = null;  
  
  // #      Case 1 : Cookie for Setup Path available and valid
  if ((setup_src_data != null) && (setup_src_data != undefined))
  {
                                    // Setup Source Cookie valid ?
    if (setup_src_data.testpattern == c_DEFAULT_SETUP_SOURCE_COOKIE.testpattern) // + Version-Check later on !!!
    {
      global_status.cookies_enabled = true;      
      global_status.setup_src_rd_okay = true;
      setup_src_type = setup_src_data.setup_src_type;
      setup_src_path = setup_src_data.setup_src_path;
    }
  }
  
  // #      Case 2 : Cookies enabled and Default Cookie for Setup Path can be written  
  if (global_status.setup_src_rd_okay == false)
  {                             
                                    // write Defaults to Setup Source Cookie and read
                                    // back to check if Cookies are activated anyhow
    setup_src_cookie.write("data", c_DEFAULT_SETUP_SOURCE_COOKIE);
    setup_src_data = setup_src_cookie.read("data"); 
    if ((setup_src_data != null) && (setup_src_data != undefined))
    {
                                    // Written Setup Source Cookie valid ?
      if (setup_src_data.testpattern == c_DEFAULT_SETUP_SOURCE_COOKIE.testpattern) // + Version-Check later on !!!
      {
        global_status.cookies_enabled = true;
        setup_src_type = setup_src_data.setup_src_type;
        setup_src_path = setup_src_data.setup_src_path;
        alert(c_LANG_MSG_SETUP_SRC_COOKIE_CREATED[global_setup.curr_lang]);        
      }
    }   
  }
  
  // #      Case 3 : Use Default Values as Setup Source
  if ((global_status.setup_src_rd_okay == false) && (global_status.cookies_enabled == false))
  {
    setup_src_type = c_DEFAULT_SETUP_SOURCE_COOKIE.setup_src_type;
    setup_src_path = c_DEFAULT_SETUP_SOURCE_COOKIE.setup_src_path;
    alert(c_LANG_MSG_COOKIES_INACTIVE[global_setup.curr_lang]);        
  }  
  global_status.actual_setup_src_type = setup_src_type;
  global_status.actual_setup_src_path = setup_src_path;
  
  
  // ### part 2 - try to open the Global Setup
                                    // Global Setup is loaded from ...
  switch (setup_src_type)
  {
                                    // ... a Cookie
    case c_DATA_SOURCE_TYPE_ID_COOKIE :
                                    // Error case : Cookies disabled
        if (global_status.cookies_enabled == false)
        {                            
          setup_src_type = c_DATA_SOURCE_TYPE_ID_NONE;
        }
        else
        {
          var setup_cookie = new lib_data_cookie(plugin_name, my_path, setup_src_path);
          var setup_data = setup_cookie.read("data");
          if ((setup_data != null) && (setup_data != undefined))
          {
            if (setup_data.testpattern == c_DEFAULT_GLOBAL_SETUP.testpattern)
            {
                                    // copy all values which are changeable
              global_setup.curr_lang = setup_data.curr_lang;
//              global_setup.tree_max_child_depth = setup_data.tree_max_child_depth; 
              global_status.global_setup_loaded = true;
              break;
            }
          }                         
                                    // if read didn't succeed : write defaults
          if (global_status.global_setup_loaded == false)
          {
            alert(c_LANG_MSG_SETUP_LOADING_FAILED[global_setup.curr_lang]);
            setup_cookie.write("data", c_DEFAULT_GLOBAL_SETUP);
            setup_data = setup_cookie.read("data");  
                                    // if still something went wrong : error !
            if (setup_data.testpattern != c_DEFAULT_GLOBAL_SETUP.testpattern)  
            {
              setup_src_type = c_DATA_SOURCE_TYPE_ID_NONE;
            }
          }
        }
    case c_DATA_SOURCE_TYPE_ID_DISCO :
    case c_DATA_SOURCE_TYPE_ID_XML :
                                    // Error case : invalid source
        setup_src_type = c_DATA_SOURCE_TYPE_ID_LENGTH;   
                                    // ... a non-persistent variable
    case c_DATA_SOURCE_TYPE_ID_NONE :
        alert(c_LANG_MSG_SETUP_LOADING_FAILED[global_setup.curr_lang]);
        break;
                                    // ... DISCO! or XML    
    default :     
        alert(c_LANG_MSG_INVALID_SETUP_SOURCE_TYPE[global_setup.curr_lang]);
        break;
  }                                    
}


// ##########################################################################
// ### System Init                                                        ###
// ##########################################################################


function global_main_init()
{
//  alert("init0");
                                    // get Sub-Directory name of instance and delete all slashes
  var my_path_raw = window.location.pathname;
  my_path = my_path_raw.replace(/\//g,''); 
                                    // adjust all GUI sizes initially
  global_main_win_resize();
                                    // load global setup
  global_main_load_setup();
                                    // choose default usecase stored in global setup
  switch (global_setup.default_usecase)
  {
    case "uc_merging" :
      curr_uc_main = new uc_merging_main( "global_main_event", global_setup, global_main_save_setup, my_path );
    case "uc_browsing" :
    default :     
      curr_uc_main = new uc_browsing_main( "global_main_event", global_setup, global_main_save_setup, my_path );
    break;
  }
  curr_uc_main.launch();
                                    // install global keyboard listener
  $(document).ready(function() {
     $(document).keydown(function(event) {
       global_main_process_extra_keys(event);
     });
     $(document).keyup(function(event) {
       global_main_key_event(event);
     });
  });

}

