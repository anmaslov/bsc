class ProductImgsController < ApplicationController
# GET /product_imgs
# GET /product_imgs.json
  def index
    #@product_imgs = ProductImg.find_all_by_product_id((params[:product].to_i))
    @product_imgs = ProductImg.where(product_id: params[:product].to_i)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @product_imgs.map{|picture| picture.to_jq_upload } }
    end
  end
# GET /product_imgs/1
# GET /product_imgs/1.json
  def show
    @product_img = ProductImg.find(params[:id])
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @product_img }
    end
  end
# GET /product_imgs/new
# GET /product_imgs/new.json
  def new
    @product_img = ProductImg.new
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @product_img }
    end
  end
# GET /product_imgs/1/edit
  def edit
    @product_img = ProductImg.find(params[:id])
  end
# POST /product_imgs
# POST /product_imgs.json
  def create
    @product_img = ProductImg.new(:picture => picture_params[:picture])
    @product_img.product = Product.find(picture_params[:product].to_i)
    respond_to do |format|
      if @product_img.save
        format.html {
          render :json => [@product_img.to_jq_upload].to_json,
                 :content_type => 'text/html',
                 :layout => false
        }
        format.json { render json: {files: [@product_img.to_jq_upload]}, status: :created, location: @product_img }
      else
        format.html { render action: "new" }
        format.json { render json: @product_img.errors, status: :unprocessable_entity }
      end
    end
  end
# PUT /product_imgs/1
# PUT /product_imgs/1.json
  def update
    @product_img = ProductImg.find(params[:id])
    respond_to do |format|
      if @product_img.update_attributes(params[:picture])
        format.html { redirect_to @product_img, notice: 'Picture was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @product_img.errors, status: :unprocessable_entity }
      end
    end
  end
# DELETE /product_imgs/1
# DELETE /product_imgs/1.json
  def destroy
    @product_img = ProductImg.find(params[:id])
    @product_img.destroy
    respond_to do |format|
      format.html { redirect_to uploads_url }
      format.json { head :no_content }
    end
  end

  private

  def picture_params
    params.require(:product_img).permit(:picture, :product)
    #params.require(:product).permit(:title, :article, :description, :image_url, :price, :catalog_id, :is_active, :image, :imgs)
  end
end