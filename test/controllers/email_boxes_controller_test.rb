require 'test_helper'

class EmailBoxesControllerTest < ActionController::TestCase
  setup do
    @email_box = email_boxes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:email_boxes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create email_box" do
    assert_difference('EmailBox.count') do
      post :create, email_box: { address: @email_box.address, description: @email_box.description }
    end

    assert_redirected_to email_box_path(assigns(:email_box))
  end

  test "should show email_box" do
    get :show, id: @email_box
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @email_box
    assert_response :success
  end

  test "should update email_box" do
    patch :update, id: @email_box, email_box: { address: @email_box.address, description: @email_box.description }
    assert_redirected_to email_box_path(assigns(:email_box))
  end

  test "should destroy email_box" do
    assert_difference('EmailBox.count', -1) do
      delete :destroy, id: @email_box
    end

    assert_redirected_to email_boxes_path
  end
end
