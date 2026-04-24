import 'package:json_annotation/json_annotation.dart';

/// Converter for DateTime that treats strings without timezone as UTC
class UtcDateTimeConverter implements JsonConverter<DateTime?, String?> {
  const UtcDateTimeConverter();

  @override
  DateTime? fromJson(String? json) {
    if (json == null) return null;

    // If the string already has timezone info (Z or +/-), parse normally
    if (json.contains('Z') || RegExp(r'[+-]\d{2}:\d{2}$').hasMatch(json)) {
      return DateTime.parse(json).toLocal();
    }

    // Otherwise, treat as UTC and convert to local
    return DateTime.parse('${json}Z').toLocal();
  }

  @override
  String? toJson(DateTime? object) {
    return object?.toUtc().toIso8601String();
  }
}
