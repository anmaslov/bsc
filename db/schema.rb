# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150328184623) do

  create_table "active_admin_comments", force: true do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "additional_descriptions", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "brands", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
  end

  create_table "carts", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "catalogs", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "keywords"
    t.text     "content"
    t.string   "image_url"
    t.integer  "parent_id",          default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.boolean  "is_active",          default: false
    t.integer  "old_id"
    t.boolean  "catalog_table",      default: false
    t.boolean  "product_table",      default: false
    t.string   "ancestry"
    t.integer  "position"
  end

  add_index "catalogs", ["catalog_table"], name: "index_catalogs_on_catalog_table", using: :btree
  add_index "catalogs", ["is_active"], name: "index_catalogs_on_is_active", using: :btree
  add_index "catalogs", ["parent_id", "is_active", "catalog_table", "product_table"], name: "index_catalogs_diff", using: :btree
  add_index "catalogs", ["parent_id"], name: "index_catalogs_on_parent_id", using: :btree
  add_index "catalogs", ["product_table"], name: "index_catalogs_on_product_table", using: :btree

  create_table "characters", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "product_id"
    t.integer  "charecter_type_id"
  end

  add_index "characters", ["charecter_type_id"], name: "index_characters_on_charecter_type_id", using: :btree
  add_index "characters", ["name", "value", "product_id", "charecter_type_id"], name: "index_characters_diff", using: :btree
  add_index "characters", ["name"], name: "index_characters_on_name", using: :btree
  add_index "characters", ["product_id"], name: "index_characters_on_product_id", using: :btree
  add_index "characters", ["value"], name: "index_characters_on_value", using: :btree

  create_table "charecter_types", force: true do |t|
    t.string   "name"
    t.integer  "type_filtr", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "charecter_types", ["name", "type_filtr"], name: "index_charecter_types_diff", using: :btree
  add_index "charecter_types", ["name"], name: "index_charecter_types_on_name", using: :btree
  add_index "charecter_types", ["type_filtr"], name: "index_charecter_types_on_type_filtr", using: :btree

  create_table "compare_items", force: true do |t|
    t.integer  "product_id"
    t.integer  "compare_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "compare_items", ["compare_id"], name: "index_compare_items_on_compare_id", using: :btree
  add_index "compare_items", ["product_id"], name: "index_compare_items_on_product_id", using: :btree

  create_table "compares", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "detailings", force: true do |t|
    t.string   "title"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "pdf_file_name"
    t.string   "pdf_content_type"
    t.integer  "pdf_file_size"
    t.datetime "pdf_updated_at"
  end

  add_index "detailings", ["product_id"], name: "index_detailings_diff", using: :btree

  create_table "details", force: true do |t|
    t.integer  "product_id"
    t.integer  "detail_for_id"
    t.string   "position_detail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "details", ["detail_for_id"], name: "index_details_on_detail_for_id", using: :btree
  add_index "details", ["position_detail"], name: "index_details_on_position_detail", using: :btree
  add_index "details", ["product_id", "detail_for_id", "position_detail"], name: "index_details_diff", using: :btree
  add_index "details", ["product_id", "detail_for_id"], name: "index_details_on_product_id_and_detail_for_id", using: :btree
  add_index "details", ["product_id"], name: "index_details_on_product_id", using: :btree

  create_table "documents", force: true do |t|
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "pdf_file_name"
    t.string   "pdf_content_type"
    t.integer  "pdf_file_size"
    t.datetime "pdf_updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "documents", ["product_id"], name: "index_documents_diff", using: :btree

  create_table "email_boxes", force: true do |t|
    t.string   "address"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "supplier_id"
  end

  create_table "emails", force: true do |t|
    t.string   "from"
    t.string   "subject"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "email_box_id"
    t.string   "message_id"
    t.boolean  "processing",   default: false
    t.boolean  "processed",    default: false
    t.integer  "supplier_id"
  end

  add_index "emails", ["supplier_id"], name: "index_emails_diff", using: :btree

  create_table "friendly_id_slugs", force: true do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
  add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
  add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
  add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

  create_table "line_items", force: true do |t|
    t.integer  "product_id"
    t.integer  "cart_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "quantity",                             default: 1
    t.integer  "order_id"
    t.decimal  "price_fixed", precision: 15, scale: 2
  end

  add_index "line_items", ["cart_id"], name: "index_line_items_on_cart_id", using: :btree
  add_index "line_items", ["order_id"], name: "index_line_items_on_order_id", using: :btree
  add_index "line_items", ["price_fixed"], name: "index_line_items_on_price_fixed", using: :btree
  add_index "line_items", ["product_id"], name: "index_line_items_on_product_id", using: :btree

  create_table "logger_bds", force: true do |t|
    t.string   "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mail_attachments", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.string   "filename"
    t.integer  "email_id"
  end

  add_index "mail_attachments", ["email_id"], name: "index_mail_attachments_diff", using: :btree

  create_table "margin_for_users", id: false, force: true do |t|
    t.integer "supplier_id"
    t.integer "user_id"
    t.float   "margin",      default: 0.0
  end

  add_index "margin_for_users", ["supplier_id", "user_id"], name: "index_margin_for_users_on_supplier_id_and_user_id", using: :btree
  add_index "margin_for_users", ["user_id"], name: "index_margin_for_users_on_user_id", using: :btree

  create_table "news", force: true do |t|
    t.string   "title"
    t.integer  "news_type"
    t.text     "description"
    t.text     "content"
    t.string   "youtube_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  create_table "old_catalogs", force: true do |t|
    t.integer  "idc"
    t.integer  "catalog_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "product_id"
  end

  create_table "orders", force: true do |t|
    t.string   "name"
    t.text     "address"
    t.string   "email"
    t.string   "pay_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "comment"
    t.string   "delivery_type"
    t.string   "phone"
    t.integer  "user_id"
    t.string   "NameOrganization"
    t.integer  "InnOrganization"
    t.integer  "status"
    t.datetime "performed_datetime"
  end

  add_index "orders", ["user_id"], name: "index_orders_on_user_id", using: :btree

  create_table "pages", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.text     "content"
    t.string   "keywords"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "slug"
    t.string   "url"
  end

  add_index "pages", ["slug"], name: "index_pages_on_slug", unique: true, using: :btree

  create_table "posts", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prices", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.integer  "supplier_id"
    t.boolean  "processed",                      default: false
    t.integer  "supplier_import_information_id"
  end

  add_index "prices", ["supplier_id", "supplier_import_information_id"], name: "index_prices_diff", using: :btree
  add_index "prices", ["supplier_id"], name: "index_prices_on_supplier_id", using: :btree
  add_index "prices", ["supplier_import_information_id"], name: "index_prices_on_supplier_import_information_id", using: :btree

  create_table "product_imgs", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
  end

  add_index "product_imgs", ["product_id"], name: "index_product_imgs_diff", using: :btree

  create_table "products", force: true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "image_url"
    t.decimal  "price",                        precision: 15, scale: 2
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "article"
    t.integer  "catalog_id",                                            default: 0
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.boolean  "is_active",                                             default: false
    t.boolean  "market_yandex",                                         default: false
    t.decimal  "old_price",                    precision: 8,  scale: 2
    t.text     "content"
    t.string   "keywords"
    t.integer  "supplier_id"
    t.integer  "quantity"
    t.integer  "detail_for_id"
    t.integer  "position_detail"
    t.boolean  "is_processed",                                          default: false
    t.integer  "brand_id"
    t.integer  "bar_code",           limit: 8
    t.string   "unit"
    t.integer  "product_id"
    t.boolean  "recommendation"
    t.datetime "updated_price_at"
  end

  add_index "products", ["article"], name: "index_products_on_article", using: :btree
  add_index "products", ["brand_id"], name: "index_products_on_brand_id", using: :btree
  add_index "products", ["detail_for_id"], name: "index_products_on_detail_for_id", using: :btree
  add_index "products", ["is_active"], name: "index_products_on_is_active", using: :btree
  add_index "products", ["market_yandex"], name: "index_products_on_market_yandex", using: :btree
  add_index "products", ["position_detail"], name: "index_products_on_position_detail", using: :btree
  add_index "products", ["price", "article", "is_active", "market_yandex", "supplier_id", "detail_for_id", "position_detail", "brand_id", "product_id", "recommendation", "unit"], name: "index_products_diff", using: :btree
  add_index "products", ["price"], name: "index_products_on_price", using: :btree
  add_index "products", ["product_id"], name: "index_products_on_product_id", using: :btree
  add_index "products", ["recommendation"], name: "index_products_on_recommendation", using: :btree
  add_index "products", ["supplier_id"], name: "index_products_on_supplier_id", using: :btree
  add_index "products", ["unit"], name: "index_products_on_unit", using: :btree

  create_table "redactor_assets", force: true do |t|
    t.integer  "user_id"
    t.string   "data_file_name",               null: false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "assetable_id"
    t.string   "assetable_type",    limit: 30
    t.string   "type",              limit: 30
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "redactor_assets", ["assetable_type", "assetable_id"], name: "idx_redactor_assetable", using: :btree
  add_index "redactor_assets", ["assetable_type", "type", "assetable_id"], name: "idx_redactor_assetable_type", using: :btree

  create_table "reports", force: true do |t|
    t.integer  "user_id"
    t.integer  "product_id"
    t.integer  "catalog_id"
    t.integer  "page_id"
    t.integer  "type_action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "reports", ["catalog_id"], name: "index_reports_on_catalog_id", using: :btree
  add_index "reports", ["created_at"], name: "index_reports_on_created_at", using: :btree
  add_index "reports", ["page_id"], name: "index_reports_on_page_id", using: :btree
  add_index "reports", ["product_id"], name: "index_reports_on_product_id", using: :btree
  add_index "reports", ["type_action"], name: "index_reports_on_type_action", using: :btree
  add_index "reports", ["updated_at"], name: "index_reports_on_updated_at", using: :btree
  add_index "reports", ["user_id", "product_id", "catalog_id", "page_id", "type_action", "created_at", "updated_at"], name: "index_reports_diff", using: :btree
  add_index "reports", ["user_id"], name: "index_reports_on_user_id", using: :btree

  create_table "roles", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles_users", id: false, force: true do |t|
    t.integer "role_id"
    t.integer "user_id"
  end

  add_index "roles_users", ["role_id", "user_id"], name: "index_roles_users_on_role_id_and_user_id", using: :btree

  create_table "sliders", force: true do |t|
    t.string   "title"
    t.string   "link"
    t.integer  "news_id"
    t.integer  "product_id"
    t.integer  "catalog_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "sliders", ["catalog_id"], name: "index_sliders_on_catalog_id", using: :btree
  add_index "sliders", ["news_id", "product_id", "catalog_id"], name: "index_sliders_diff", using: :btree
  add_index "sliders", ["news_id"], name: "index_sliders_on_news_id", using: :btree
  add_index "sliders", ["product_id"], name: "index_sliders_on_product_id", using: :btree

  create_table "supplier_import_informations", force: true do |t|
    t.decimal  "margin",           precision: 10, scale: 0
    t.integer  "first_row"
    t.integer  "article_column"
    t.integer  "title_column"
    t.integer  "quantity_column"
    t.integer  "price_column"
    t.integer  "supplier_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "characters_title"
    t.string   "characters"
    t.integer  "product_id"
    t.integer  "bar_code"
    t.integer  "unit"
  end

  add_index "supplier_import_informations", ["supplier_id"], name: "index_s_import_inf", using: :btree

  create_table "suppliers", force: true do |t|
    t.string   "title"
    t.string   "subject"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "email_id"
    t.integer  "product_id"
    t.integer  "email_box_id"
    t.string   "email_address"
    t.integer  "supplier_import_information_id"
    t.float    "margin",                         default: 0.0
  end

  add_index "suppliers", ["margin"], name: "index_suppliers_on_margin", using: :btree

  create_table "uploads", force: true do |t|
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin"
    t.string   "phone"
    t.text     "address"
    t.string   "name"
    t.string   "NameOrganization"
    t.integer  "InnOrganization"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
