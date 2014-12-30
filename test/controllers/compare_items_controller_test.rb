require 'test_helper'

class CompareItemsControllerTest < ActionController::TestCase
  setup do
    @compare_item = compare_items(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:compare_items)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create compare_item" do
    assert_difference('CompareItem.count') do
      post :create, compare_item: { cart_id: @compare_item.cart_id, product_id: @compare_item.product_id }
    end

    assert_redirected_to compare_item_path(assigns(:compare_item))
  end

  test "should show compare_item" do
    get :show, id: @compare_item
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @compare_item
    assert_response :success
  end

  test "should update compare_item" do
    patch :update, id: @compare_item, compare_item: { cart_id: @compare_item.cart_id, product_id: @compare_item.product_id }
    assert_redirected_to compare_item_path(assigns(:compare_item))
  end

  test "should destroy compare_item" do
    assert_difference('CompareItem.count', -1) do
      delete :destroy, id: @compare_item
    end

    assert_redirected_to compare_items_path
  end
end
