// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryModel _$CategoryModelFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CategoryModel', json, ($checkedConvert) {
      final val = CategoryModel(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        slug: $checkedConvert('slug', (v) => v as String),
        description: $checkedConvert('description', (v) => v as String?),
        featured: $checkedConvert('featured', (v) => v as bool),
        createdDate: $checkedConvert(
          'createdDate',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        updatedDate: $checkedConvert(
          'updatedDate',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        deleted: $checkedConvert('deleted', (v) => v as bool? ?? false),
      );
      return val;
    });

Map<String, dynamic> _$CategoryModelToJson(CategoryModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': ?instance.description,
      'featured': instance.featured,
      'createdDate': ?instance.createdDate?.toIso8601String(),
      'updatedDate': ?instance.updatedDate?.toIso8601String(),
      'deleted': instance.deleted,
    };
