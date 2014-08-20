require 'test_helper'

class SupplierImportInformationsControllerTest < ActionController::TestCase
  setup do
    @supplier_import_information = supplier_import_informations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:supplier_import_informations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create supplier_import_information" do
    assert_difference('SupplierImportInformation.count') do
      post :create, supplier_import_information: { article_column: @supplier_import_information.article_column, first_row: @supplier_import_information.first_row, margin: @supplier_import_information.margin, price_column: @supplier_import_information.price_column, quantity_column: @supplier_import_information.quantity_column, supplier_id: @supplier_import_information.supplier_id, title_column: @supplier_import_information.title_column }
    end

    assert_redirected_to supplier_import_information_path(assigns(:supplier_import_information))
  end

  test "should show supplier_import_information" do
    get :show, id: @supplier_import_information
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @supplier_import_information
    assert_response :success
  end

  test "should update supplier_import_information" do
    patch :update, id: @supplier_import_information, supplier_import_information: { article_column: @supplier_import_information.article_column, first_row: @supplier_import_information.first_row, margin: @supplier_import_information.margin, price_column: @supplier_import_information.price_column, quantity_column: @supplier_import_information.quantity_column, supplier_id: @supplier_import_information.supplier_id, title_column: @supplier_import_information.title_column }
    assert_redirected_to supplier_import_information_path(assigns(:supplier_import_information))
  end

  test "should destroy supplier_import_information" do
    assert_difference('SupplierImportInformation.count', -1) do
      delete :destroy, id: @supplier_import_information
    end

    assert_redirected_to supplier_import_informations_path
  end
end
