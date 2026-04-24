// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'image_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ImageUrlsModel _$ImageUrlsModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ImageUrlsModel', json, ($checkedConvert) {
      final val = ImageUrlsModel(
        w236: $checkedConvert('w236', (v) => v as String),
        w474: $checkedConvert('w474', (v) => v as String),
        w736: $checkedConvert('w736', (v) => v as String),
        w1080: $checkedConvert('w1080', (v) => v as String),
        original: $checkedConvert('original', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$ImageUrlsModelToJson(ImageUrlsModel instance) =>
    <String, dynamic>{
      'w236': instance.w236,
      'w474': instance.w474,
      'w736': instance.w736,
      'w1080': instance.w1080,
      'original': instance.original,
    };

ImageModel _$ImageModelFromJson(Map<String, dynamic> json) => $checkedCreate(
  'ImageModel',
  json,
  ($checkedConvert) {
    final val = ImageModel(
      id: $checkedConvert('id', (v) => v as String),
      creatorModel: $checkedConvert(
        'creator',
        (v) => UserBasicModel.fromJson(v as Map<String, dynamic>),
      ),
      imageUrlsModel: $checkedConvert(
        'imageUrls',
        (v) => ImageUrlsModel.fromJson(v as Map<String, dynamic>),
      ),
      likeCount: $checkedConvert('likeCount', (v) => (v as num).toInt()),
      commentCount: $checkedConvert('commentCount', (v) => (v as num).toInt()),
      createdDate: $checkedConvert(
        'createdDate',
        (v) => DateTime.parse(v as String),
      ),
      price: $checkedConvert('price', (v) => (v as num).toDouble()),
      liked: $checkedConvert('liked', (v) => v as bool),
      width: $checkedConvert('width', (v) => (v as num?)?.toInt()),
      height: $checkedConvert('height', (v) => (v as num?)?.toInt()),
      categoryModels: $checkedConvert(
        'categories',
        (v) => (v as List<dynamic>?)
            ?.map((e) => CategoryModel.fromJson(e as Map<String, dynamic>))
            .toList(),
      ),
      description: $checkedConvert('description', (v) => v as String?),
      purchased: $checkedConvert('purchased', (v) => v as bool?),
      visible: $checkedConvert('visible', (v) => v as bool?),
    );
    return val;
  },
  fieldKeyMap: const {
    'creatorModel': 'creator',
    'imageUrlsModel': 'imageUrls',
    'categoryModels': 'categories',
  },
);

Map<String, dynamic> _$ImageModelToJson(ImageModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'likeCount': instance.likeCount,
      'commentCount': instance.commentCount,
      'createdDate': instance.createdDate.toIso8601String(),
      'price': instance.price,
      'liked': instance.liked,
      'width': ?instance.width,
      'height': ?instance.height,
      'description': ?instance.description,
      'purchased': ?instance.purchased,
      'visible': ?instance.visible,
      'creator': instance.creatorModel.toJson(),
      'imageUrls': instance.imageUrlsModel.toJson(),
      'categories': ?instance.categoryModels?.map((e) => e.toJson()).toList(),
    };
